import { FakeCustomerRepository } from '@modules/customer/repository/fakes/FakeCustomerRepository';
import { Product } from '@modules/product/entities/Product';
import { FakeProductRepository } from '@modules/product/repository/fakes/FakeProductRepository';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import { FakeOrderProductRepository } from '../repository/fakes/FakeOrderProductRepository';
import { FakeOrderRepository } from '../repository/fakes/FakeOrderRepository';
import { OrderService } from './order.service';

describe('Order Service', () => {
    let orderService: OrderService;
    let fakeProductRepository: FakeProductRepository;
    let fakeCustomerRepository: FakeCustomerRepository;
    let fakeMailProvider: FakeMailProvider;

    const generateCustomers = () => {
        fakeCustomerRepository.create(
            {
                id: 1,
                street: 'Largo Prefeito Severino Procópio',
                neighborhood: 'Centro',
                city: 'Campina Grande',
                state: 'PB',
                country: 'BR',
                number: '198',
                cep: '58400-293',
            },
            {
                id: 1,
                name: 'Delviniano Albernás',
                email: 'delv@alb.com',
                cpf: '117.534.440-04',
                dtBirth: '1992-02-12',
            },
        );
    };

    const generateProducts = () => {
        fakeProductRepository.create({
            id: 1,
            name: 'Notebook Acer Nitro 5',
            image: 'image_path',
            description:
                'Notebook Gamer Acer Nitro 5 Intel Core i5-10300H, NVIDIA GeForce GTX 1650, 8GB, SSD 512GB, 15.6 Full HD Ultrafino, Preto',
            weight: 4,
            price: 4599,
            qttStock: 10,
        });

        fakeProductRepository.create({
            id: 2,
            name: 'Notebook Acer Nitro 6',
            image: 'image_path',
            description:
                'Notebook Gamer Acer Nitro 6 Intel Core i5-10300H, NVIDIA GeForce GTX 1650, 8GB, SSD 512GB, 15.6 Full HD Ultrafino, Preto',
            weight: 4,
            price: 4599,
            qttStock: 10,
        });
    };

    beforeEach(() => {
        fakeProductRepository = new FakeProductRepository();
        fakeCustomerRepository = new FakeCustomerRepository();
        fakeMailProvider = new FakeMailProvider();

        generateProducts();
        generateCustomers();
        orderService = new OrderService(
            new FakeOrderRepository(),
            new FakeOrderProductRepository(),
            fakeProductRepository,
            fakeCustomerRepository,
            fakeMailProvider,
        );
    });

    it('Should be create one order', async () => {
        const sendEmail = spyOn(fakeMailProvider, 'sendEmail');

        const resOrder = await orderService.execute({
            idCustomer: 1,
            installment: 3,
            listProducts: [
                { id: 1, qtt: 2 },
                { id: 2, qtt: 2 },
            ],
        });

        const resExpect = {
            testEmailUrl: '',
            order: {
                id: 1,
                customer: { name: 'Delviniano Albernás', id: 1 },
                installment: 3,
                status: 'approved',
                dtOrder: resOrder.order.dtOrder,
            },
            products: [
                { id: 1, name: 'Notebook Acer Nitro 5', qttStock: 8 },
                { id: 2, name: 'Notebook Acer Nitro 6', qttStock: 8 },
            ],
        };

        const messageBody = `<!DOCTYPE html> <html> <head> <meta name="viewport" content="width=device-width"/> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/> <title>Order Confirmation</title> <style>body{background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;}table{border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;}table td{font-family: sans-serif; font-size: 14px; vertical-align: top;}.body{background-color: #f6f6f6; width: 100%;}.container{display: block; margin: 0 auto !important; max-width: 580px; padding: 10px; width: 580px;}.content{box-sizing: border-box; display: block; margin: 0 auto; max-width: 580px; padding: 10px;}.main{background: #fff; border-radius: 3px; width: 100%;}.wrapper{box-sizing: border-box; padding: 20px;}h1, h2, h3, h4{color: #000000; font-family: sans-serif; font-weight: 400; line-height: 1.4; margin: 0; margin-bottom: 30px;}h1{font-size: 35px; font-weight: 300; text-align: center; text-transform: capitalize;}p, ul, ol{font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;}p li, ul li, ol li{list-style-position: inside; margin-left: 5px;}.last{margin-bottom: 0;}.first{margin-top: 0;}.align-center{text-align: center;}.align-right{text-align: right;}.align-left{text-align: left;}.clear{clear: both;}.mt0{margin-top: 0;}.mb0{margin-bottom: 0;}.preheader{color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;}hr{border: 0; border-bottom: 1px solid #f6f6f6; margin: 20px 0;}@media only screen and (max-width: 620px){table[class='body'] h1{font-size: 28px !important; margin-bottom: 10px !important;}table[class='body'] p, table[class='body'] ul, table[class='body'] ol, table[class='body'] td, table[class='body'] span, table[class='body'] a{font-size: 16px !important;}table[class='body'] .wrapper, table[class='body'] .article{padding: 10px !important;}table[class='body'] .content{padding: 0 !important;}table[class='body'] .container{padding: 0 !important; width: 100% !important;}table[class='body'] .main{border-left-width: 0 !important; border-radius: 0 !important; border-right-width: 0 !important;}table[class='body'] .btn table{width: 100% !important;}table[class='body'] .btn a{width: 100% !important;}table[class='body'] .img-responsive{height: auto !important; max-width: 100% !important; width: auto !important;}}@media all{.ExternalClass{width: 100%;}.ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div{line-height: 100%;}.apple-link a{color: inherit !important; font-family: inherit !important; font-size: inherit !important; font-weight: inherit !important; line-height: inherit !important; text-decoration: none !important;}}</style> </head> <body class=""> <table border="0" cellpadding="0" cellspacing="0" class="body"> <tr> <td>&nbsp;</td><td class="container"> <div class="content"> <table class="main"> <tr> <td class="wrapper"> <table border="0" cellpadding="0" cellspacing="0"> <tr> <td> <h1>Order Confirmation</h1> <h2> Hello, ${resExpect.order.customer.name}! </h2> <table border="0" cellpadding="0" cellspacing="0" class="btn btn-primary"> <tbody> <tr> <td align="left"> <table border="0" cellpadding="0" cellspacing="0"> <tbody> <tr> <td> <h4>We received your order number #${resExpect.order.id}</h4> </td></tr></tbody> </table> </td></tr></tbody> </table> <p> If you received this email by mistake, simply delete it. </p></td></tr></table> </td></tr></table> </div></td><td>&nbsp;</td></tr></table> </body> </html>`;
        expect(sendEmail).toHaveBeenCalledWith(
            'delv@alb.com',
            messageBody,
            `Order confirmation number #${resExpect.order.id}`,
        );
        expect(resOrder).toMatchObject(resExpect);
    });

    it('Should be check if stock is not available given on quantity for one product', () => {
        const productIdOne = fakeProductRepository.products.find(
            fakeProd => fakeProd.id === 1,
        );

        const isAvailable = orderService.checkStockAvailable(
            { id: 1, qtt: 12 },
            productIdOne as Product,
        );

        expect(isAvailable).toBeFalsy();
    });

    it('Should be check if stock is available given on quantity for one product', () => {
        const productIdOne = fakeProductRepository.products.find(
            fakeProd => fakeProd.id === 1,
        );

        const isAvailableLess = orderService.checkStockAvailable(
            { id: 1, qtt: 8 },
            productIdOne as Product,
        );

        const isAvailableEqual = orderService.checkStockAvailable(
            { id: 1, qtt: 10 },
            productIdOne as Product,
        );

        expect(isAvailableLess).toBeTruthy();
        expect(isAvailableEqual).toBeTruthy();
    });
});
