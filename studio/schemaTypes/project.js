export default {
  name: 'project',
  title: 'Obras',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Nombre de la obra',
      type: 'string',
      description: 'Como se muestra en el sitio, en minúscula, ej: mendoza',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Identificador (URL)',
      type: 'slug',
      description: 'Se genera solo a partir del nombre. No lo cambies en obras que ya existen, o se les rompe el link.',
      options: {source: 'name', maxLength: 96},
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'subtitle',
      title: 'Subtítulo',
      type: 'string',
      description: 'Ej: reforma integral · interiorismo',
    },
    {
      name: 'year',
      title: 'Año',
      type: 'string',
    },
    {
      name: 'photographer',
      title: 'Fotografía (créditos)',
      type: 'string',
    },
    {
      name: 'order',
      title: 'Orden en la grilla de proyectos',
      type: 'number',
      description: 'Los números más bajos aparecen primero. Podés dejarlo en blanco.',
    },
    {
      name: 'photos',
      title: 'Fotos',
      type: 'array',
      description: 'Arrastrá para reordenar. El orden acá es el orden en la ficha de la obra.',
      of: [
        {
          type: 'object',
          name: 'photo',
          fields: [
            {
              name: 'image',
              title: 'Imagen',
              type: 'image',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'width',
              title: 'Ancho',
              type: 'string',
              options: {
                list: [
                  {title: 'Completo (ocupa toda la fila)', value: 'full'},
                  {title: 'Mitad (va en pareja con la siguiente)', value: 'half'},
                ],
                layout: 'radio',
              },
              initialValue: 'full',
            },
          ],
          preview: {
            select: {media: 'image', width: 'width'},
            prepare({media, width}) {
              return {title: width === 'half' ? 'mitad' : 'completo', media}
            },
          },
        },
      ],
    },
  ],
  preview: {
    select: {title: 'name', media: 'photos.0.image'},
  },
}
