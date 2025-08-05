import {defineBlueprint, defineDocumentFunction} from '@sanity/blueprints'

export default defineBlueprint({
  resources: [
    defineDocumentFunction({
      name: 'first-published',
      event: {
        on: ['publish'],
        filter: '_type == "event" && !defined(firstPublished)',
      },
    }),
  ],
})
