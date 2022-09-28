import { registerCommercePlugin } from '@builder.io/commerce-plugin-tools';
import pkg from '../package.json';
import { KiboCommerce } from '../utils/kibocommerce';

registerCommercePlugin(
  {
    id: pkg.name,
    name: 'KiboCommerce',
    settings: [
      {
        name: 'apiHost',
        type: 'string',
        required: true,
      },
      {
        name: 'authHost',
        type: 'string',
        required: true,
      },
      {
        name: 'sharedSecret',
        type: 'string',
        required: true,
      },
      {
        name: 'clientId',
        type: 'string',
        required: true,
      },
    ],
    ctaText: `Connect your KiboCommerce store`,
  },
  settings => {
    const apiHost = settings.get('apiHost');
    const authHost = settings.get('authHost');
    const sharedSecret = settings.get('sharedSecret');
    const clientId = settings.get('clientId');

    const config = { apiHost, authHost, sharedSecret, clientId };
    const kiboClient = new KiboCommerce(config, {});
    const PAGE_SIZE = 16;

    const transformProduct = resource => ({
      ...resource,
      id: resource?.productCode,
      title: resource?.content?.productName,
      handle: resource?.productCode,
      image: {
        src: resource?.content?.productImages[0]?.imageUrl,
      },
    });

    const transformCategory = resource => ({
      ...resource,
      id: resource?.categoryCode,
      title: resource?.content?.name,
      handle: resource?.categoryCode,
      image: {
        src: resource?.content?.categoryImages[0]?.imageUrl,
      },
    });

    const service = {
      product: {
        async findById(productCode) {
          const products = await kiboClient.getItemsByProductCode(PAGE_SIZE, [productCode]);
          return transformProduct(products[0]);
        },

        async search(searchTerm) {
          const searchOptions = {
            query: searchTerm,
            filter: '',
            pageSize: PAGE_SIZE,
            startIndex: 1,
          };

          let products = await kiboClient.perfromProductSearch(searchOptions);
          return products.items?.map(transformProduct);
        },

        getRequestObject(productCode) {
          return productCode;
        },
      },
      category: {
        async findById(categoryCode) {
          const categories = await kiboClient.getItemsByCategoryCode(PAGE_SIZE, [categoryCode]);
          return transformCategory(categories[0]);
        },

        async search(searchTerm) {
          const searchOptions = {
            query: searchTerm,
            filter: '',
            pageSize: PAGE_SIZE,
            startIndex: 1,
          };

          let categories = await kiboClient.perfromCategorySearch(searchOptions);
          return categories.items?.map(transformCategory); 
        },

        getRequestObject(categoryCode) {
          return categoryCode;
        },
      },
    };

    return service;
  }
);
