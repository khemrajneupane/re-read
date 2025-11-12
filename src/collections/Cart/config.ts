import type { CollectionConfig } from 'payload'
export const Carts: CollectionConfig = {
  slug: 'carts',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['id', 'user', 'items'],
  },
  access: {
    read: () => true, //({ req: { user } }) => user?.role === 'admin' || { user: { equals: user?.id } },
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'items',
      type: 'array',
      fields: [
        {
          name: 'post',
          type: 'relationship',
          relationTo: 'posts',
          required: true,
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          min: 1,
        },
        {
          name: 'price',
          type: 'number',
          required: true,
        },
        {
          name: 'buyerEmail',
          type: 'email',
          required: false, // Required only if no user is linked
        },
        {
          name: 'title',
          type: 'text',
          required: false,
        },

        /* {
          name: 'paymentIntent',
          label: 'Payment Intent ID',
          type: 'text',
          required: false,
        },*/
      ],
    },
    /* {
      name: 'paymentIntent',
      label: 'Payment Intent ID',
      type: 'text',
      required: false,
    },
    {
      name: 'paymentIntentId',
      type: 'text',
      required: false,
    },*/
    {
      name: 'paymentIntentId',
      type: 'text',
      required: false,
    },
  ],
}
