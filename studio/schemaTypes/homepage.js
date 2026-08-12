export default {
  name: 'homepage',
  title: 'Home',
  type: 'document',
  fields: [
    {
      name: 'heroImages',
      title: 'Fotos del inicio (slideshow)',
      type: 'array',
      description: 'Las fotos van alternando solas en la home. Arrastrá para reordenar, agregá o sacá las que quieras.',
      of: [{type: 'image'}],
      validation: (Rule) => Rule.min(1),
    },
  ],
  preview: {
    prepare() {
      return {title: 'Fotos de la home'}
    },
  },
}
