import {defineField, defineType} from 'sanity'
import { PinIcon } from '@sanity/icons'

export const venueType = defineType({
  name: 'venue',
  title: 'Venue',
  icon: PinIcon,
  type: 'document',
  fieldsets: [
    {name: 'address', title: 'Address', options: {columns: 2}},
  ],
  fields: [
    defineField({
      name: 'name',
      type: 'string',
    }),
    defineField({
      name: 'city',
      type: 'string',
      fieldset: 'address',
    }),
    defineField({
      name: 'country',
      type: 'string',
      fieldset: 'address',
    }),
  ],
})