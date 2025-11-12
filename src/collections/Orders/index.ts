import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['orderedDate', 'buyerEmail', 'paid', 'totalPrice'], // updated column names
  },
  access: {
    read: () => true,
    create: () => true, // Allow both logged-in and guest purchases
  },
  fields: [
    {
      name: 'orderedDate',
      type: 'date',
      admin: {
        readOnly: true,
      },
      defaultValue: () => new Date(),
    },

    // User relationship (optional for guests)
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: false,
      admin: {
        readOnly: true,
        condition: (data) => !!data?.user,
      },
      hooks: {
        beforeChange: [({ req }) => req.user?.id || null],
      },
    },

    // Buyer email (required if no user linked)
    {
      name: 'buyerEmail',
      type: 'email',
      required: false,
      admin: {
        condition: (data) => !data?.user,
      },
      validate: (val, { data }) => {
        if (!(data as { user?: unknown })?.user && !val) {
          return 'Email is required for guest orders'
        }
        return true
      },
    },

    // ✅ NEW: multiple products array
    {
      name: 'products',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'post',
          type: 'relationship',
          relationTo: 'posts',
          required: true,
        },
        {
          name: 'price',
          type: 'number',
          required: true,
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          min: 1,
          defaultValue: 1,
        },
        {
          name: 'title',
          type: 'text',
          required: false,
        },
      ],
    },

    // ✅ NEW: total price field
    {
      name: 'totalPrice',
      type: 'number',
      required: true,
    },

    {
      name: 'status',
      type: 'select',
      options: ['pending', 'paid', 'failed'],
      defaultValue: 'pending',
    },

    {
      name: 'paymentIntent',
      label: 'Payment Intent ID',
      type: 'text',
      required: false,
    },
    {
      name: 'paymentIntentClientSecret',
      label: 'Payment Intent Client Secret',
      type: 'text',
      required: false,
      admin: {
        readOnly: true,
      },
    },

    {
      name: 'paid',
      label: 'paid',
      type: 'checkbox',
    },
  ],
}
