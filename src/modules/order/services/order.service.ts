import { Customer } from '@modules/customer/entities/Customer';
import { ICustomerRepository } from '@modules/customer/repository/ICustomerRepository';
import { AddOrderInput } from '@modules/order/schemas/types-input/AddOrderInput';
import { Product } from '@modules/product/entities/Product';
import { IProductStatus } from '@modules/product/interfaces/IProductStatus';
import IProductRepository from '@modules/product/repository/IProductRepository';
import { ProductInOrder } from '@modules/product/schemas/types-input/ProductInOrder';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import { Order } from '../entities/Order';
import IOrderProductRepository from '../repository/IOrderProductRepository';
import IOrderRepository from '../repository/IOrderRepository';

export class OrderService {
    constructor(
        private orderRepository: IOrderRepository,
        private orderProductRepository: IOrderProductRepository,
        private productRepository: IProductRepository,
        private customerRepository: ICustomerRepository,
        private mailProvider: IMailProvider,
    ) {}

    async execute(reqOrder: AddOrderInput): Promise<{
        order: Order;
        products: Product[];
        testEmailUrl: string;
    }> {
        const { listProducts, idCustomer, installment } = reqOrder;
        const customer = await this.customerRepository.findeById(idCustomer);
        if (!customer) {
            throw Error(`Customer was not found.`);
        }

        const prodIds = [];
        for (let i = 0; i < listProducts.length; i += 1) {
            prodIds.push(listProducts[i].id);
        }
        const products = await this.productRepository.findByListIds(prodIds);

        const listProductStatus = listProducts.map(prodInOrder =>
            this.createListProductStatus(prodInOrder, products),
        );
        listProductStatus.forEach(prodStatus => {
            if (!prodStatus.productDB) {
                throw Error(`Product ${prodStatus.prodId} was not found.`);
            }
            if (!prodStatus.hasInStock) {
                throw Error(
                    `Product ${prodStatus.productDB.name} is out of stock.`,
                );
            }
        });

        const orderSaved = await this.orderRepository.createOrder(
            customer,
            installment,
        );
        const testEmailUrl = await this.sendEmailOrder(customer, orderSaved);
        await this.productRepository.updateStock(listProductStatus);
        await this.orderProductRepository.createOrderProduct(
            orderSaved,
            listProductStatus,
        );
        const orderProducts = await this.orderProductRepository.findByOrder(
            orderSaved,
        );
        return {
            testEmailUrl: typeof testEmailUrl === 'string' ? testEmailUrl : '',
            order: orderSaved,
            products: orderProducts.map(orderProd => orderProd.product),
        };
    }

    private createListProductStatus(
        prodInOrder: ProductInOrder,
        products: Product[],
    ): IProductStatus {
        const productDB = products.find(prod => prod.id === prodInOrder.id);
        const hasInStock = this.checkStockAvailable(prodInOrder, productDB);
        return {
            hasInStock,
            productDB,
            qttWanted: prodInOrder.qtt,
            prodId: prodInOrder.id,
        };
    }

    private async sendEmailOrder(
        customer: Customer,
        order: Order,
    ): Promise<string | boolean> {
        const { name, email } = customer;

        const messageBody = `<!DOCTYPE html>
        <html>

        <head>
            <meta name="viewport" content="width=device-width" />
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
            <title>Order Confirmation</title>
            <style>
                body {
                    background-color: #f6f6f6;
                    font-family: sans-serif;
                    -webkit-font-smoothing: antialiased;
                    font-size: 14px;
                    line-height: 1.4;
                    margin: 0;
                    padding: 0;
                    -ms-text-size-adjust: 100%;
                    -webkit-text-size-adjust: 100%;
                }

                table {
                    border-collapse: separate;
                    mso-table-lspace: 0pt;
                    mso-table-rspace: 0pt;
                    width: 100%;
                }

                table td {
                    font-family: sans-serif;
                    font-size: 14px;
                    vertical-align: top;
                }

                .body {
                    background-color: #f6f6f6;
                    width: 100%;
                }

                .container {
                    display: block;
                    margin: 0 auto !important;
                    max-width: 580px;
                    padding: 10px;
                    width: 580px;
                }

                .content {
                    box-sizing: border-box;
                    display: block;
                    margin: 0 auto;
                    max-width: 580px;
                    padding: 10px;
                }

                .main {
                    background: #fff;
                    border-radius: 3px;
                    width: 100%;
                }

                .wrapper {
                    box-sizing: border-box;
                    padding: 20px;
                }

                h1,
                h2,
                h3,
                h4 {
                    color: #000000;
                    font-family: sans-serif;
                    font-weight: 400;
                    line-height: 1.4;
                    margin: 0;
                    margin-bottom: 30px;
                }

                h1 {
                    font-size: 35px;
                    font-weight: 300;
                    text-align: center;
                    text-transform: capitalize;
                }

                p,
                ul,
                ol {
                    font-family: sans-serif;
                    font-size: 14px;
                    font-weight: normal;
                    margin: 0;
                    margin-bottom: 15px;
                }

                p li,
                ul li,
                ol li {
                    list-style-position: inside;
                    margin-left: 5px;
                }

                .last {
                    margin-bottom: 0;
                }

                .first {
                    margin-top: 0;
                }

                .align-center {
                    text-align: center;
                }

                .align-right {
                    text-align: right;
                }

                .align-left {
                    text-align: left;
                }

                .clear {
                    clear: both;
                }

                .mt0 {
                    margin-top: 0;
                }

                .mb0 {
                    margin-bottom: 0;
                }

                .preheader {
                    color: transparent;
                    display: none;
                    height: 0;
                    max-height: 0;
                    max-width: 0;
                    opacity: 0;
                    overflow: hidden;
                    mso-hide: all;
                    visibility: hidden;
                    width: 0;
                }

                hr {
                    border: 0;
                    border-bottom: 1px solid #f6f6f6;
                    margin: 20px 0;
                }

                @media only screen and (max-width: 620px) {
                    table[class='body'] h1 {
                        font-size: 28px !important;
                        margin-bottom: 10px !important;
                    }

                    table[class='body'] p,
                    table[class='body'] ul,
                    table[class='body'] ol,
                    table[class='body'] td,
                    table[class='body'] span,
                    table[class='body'] a {
                        font-size: 16px !important;
                    }

                    table[class='body'] .wrapper,
                    table[class='body'] .article {
                        padding: 10px !important;
                    }

                    table[class='body'] .content {
                        padding: 0 !important;
                    }

                    table[class='body'] .container {
                        padding: 0 !important;
                        width: 100% !important;
                    }

                    table[class='body'] .main {
                        border-left-width: 0 !important;
                        border-radius: 0 !important;
                        border-right-width: 0 !important;
                    }

                    table[class='body'] .btn table {
                        width: 100% !important;
                    }

                    table[class='body'] .btn a {
                        width: 100% !important;
                    }

                    table[class='body'] .img-responsive {
                        height: auto !important;
                        max-width: 100% !important;
                        width: auto !important;
                    }
                }

                @media all {
                    .ExternalClass {
                        width: 100%;
                    }

                    .ExternalClass,
                    .ExternalClass p,
                    .ExternalClass span,
                    .ExternalClass font,
                    .ExternalClass td,
                    .ExternalClass div {
                        line-height: 100%;
                    }

                    .apple-link a {
                        color: inherit !important;
                        font-family: inherit !important;
                        font-size: inherit !important;
                        font-weight: inherit !important;
                        line-height: inherit !important;
                        text-decoration: none !important;
                    }
                }
            </style>
        </head>

        <body class="">
            <table border="0" cellpadding="0" cellspacing="0" class="body">
                <tr>
                    <td>&nbsp;</td>
                    <td class="container">
                        <div class="content">
                            <table class="main">
                                <tr>
                                    <td class="wrapper">
                                        <table border="0" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td>
                                                    <h1>Order Confirmation</h1>
                                                    <h2>
                                                        Hello, ${name}!
                                                    </h2>
                                                    <table border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
                                                        <tbody>
                                                            <tr>
                                                                <td align="left">
                                                                    <table border="0" cellpadding="0" cellspacing="0">
                                                                        <tbody>
                                                                            <tr>
                                                                                <td>
                                                                                    <h4>We received your order number
                                                                                        #${order.id}</h4>
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                    <p>
                                                        If you received this email
                                                        by mistake, simply delete
                                                        it.
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </td>
                    <td>&nbsp;</td>
                </tr>
            </table>
        </body>

        </html>
        `
        const resultMessageUrl = await this.mailProvider.sendEmail(
            email,
            messageBody,
            `Order confirmation number #${order.id}`,
        );
        return resultMessageUrl;
    }

    public checkStockAvailable(
        prodInOrder: ProductInOrder,
        product: Product | undefined,
    ): boolean {
        if (!product) {
            return false;
        }
        const { qttStock: qttInStock } = product;
        const { qtt: qttToBuy } = prodInOrder;

        return qttInStock >= qttToBuy;
    }
}
