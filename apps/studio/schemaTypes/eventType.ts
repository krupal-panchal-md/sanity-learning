import { defineField, defineType } from 'sanity'
import { CalendarIcon, CogIcon, EditIcon } from '@sanity/icons'
import {DoorsOpenInput} from './components/DoorsOpenInput'

export const eventType = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  groups: [
    {name: 'details', title: 'Details', icon: CogIcon},
    {name: 'editorial', title: 'Editorial', icon: EditIcon},
  ],
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      title: 'Event Name',
      group: 'details',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      group: 'details',
      options: {source: 'name'},
      validation: (rule) => rule.required().error(`Required to generate a page on the website`),
      hidden: ({document}) => !document?.name,
      readOnly: ({value, currentUser}) => {
        // Anyone can set the initial slug
        if (!value) {
          return false
        }
    
        const isAdmin = currentUser?.roles.some((role) => role.name === 'administrator')
    
        // Only admins can change the slug
        return !isAdmin
      },
    }),
    defineField({
      name: 'eventType',
      type: 'string',
      options: {
        list: [
          {title: 'In Person', value: 'in-person'},
          {title: 'Virtual', value: 'virtual'},
          {title: 'Hybrid', value: 'hybrid'},
        ],
        layout: 'radio',
      },
      group: 'details',
    }),
    defineField({
      name: 'date',
      type: 'datetime',
      group: 'details',
    }),
    defineField({
      name: 'doorsOpen',
      type: 'number',
      initialValue: 60,
      group: 'details',
      components: {
        input: DoorsOpenInput
      }
    }),
    defineField({
      name: 'venue',
      type: 'reference',
      to: [{ type: 'venue' }],
      readOnly: ({ value, document }) => !value && document?.eventType === 'virtual',
      validation: (rule) =>
        rule.custom((value, context) => {
          if (value && context?.document?.eventType === 'virtual') {
            return 'Only in-person events can have a venue'
          }

          return true
        }),
      group: 'details',
    }),
    defineField({
      name: 'headline',
      type: 'reference',
      to: [{ type: 'artist' }],
      group: 'editorial',
    }),
    defineField({
      name: 'image',
      type: 'image',
      group: 'editorial',
    }),
    defineField({
      name: 'details',
      type: 'array',
      of: [{ type: 'block' }],
      group: 'editorial',
    }),
    defineField({
      name: 'tickets',
      type: 'url',
      group: 'editorial',
    }),
    defineField({
      name: 'firstPublished',
      description: 'Automatically set when first published',
      type: 'datetime',
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      name: 'name',
      venue: 'venue.name',
      artist: 'headline.name',
      date: 'date',
      image: 'image',
    },
    prepare({name, venue, artist, date, image}) {
      const nameFormatted = name || 'Untitled event'
      const dateFormatted = date
        ? new Date(date).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          })
        : ''
  
      return {
        title: artist ? `${nameFormatted} (${artist})` : nameFormatted,
        subtitle: venue ? `${dateFormatted} @ ${venue}` : dateFormatted,
        media: image || CalendarIcon,
      }
    },
  },
})