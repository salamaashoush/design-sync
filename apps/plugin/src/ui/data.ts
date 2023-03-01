export const TOKEN_SET_1 = {
  name: 'Global',
  id: 'global',
  tokens: {
    border: {
      small: {
        name: 'Small',
        value: {
          width: 1,
          style: 'solid',
          color: '#000000',
        },
        type: 'border',
      },
      medium: {
        name: 'Medium',
        value: {
          width: 2,
          style: 'solid',
          color: '#000000',
        },
        type: 'border',
      },
      large: {
        name: 'Large',
        value: {
          width: 4,
          style: 'solid',
          color: '#000000',
        },
        type: 'border',
      },
      dashed: {
        name: 'Dashed',
        value: {
          width: 4,
          style: 'dashed',
          color: '#000000',
        },
        type: 'border',
      },
    },
    typography: {
      label: {
        name: 'Label',
        value: {
          fontFamily: 'Inter',
          fontWeight: '500',
          fontSize: '14px',
          lineHeight: '20px',
          letterSpacing: '0px',
          textDecoration: 'none',
          textCase: 'none',
        },
        type: 'typography',
      },

      heading1: {
        name: 'Heading 1',
        value: {
          fontFamily: 'Inter',
          fontWeight: '900',
          fontSize: '48px',
          lineHeight: '56px',
          letterSpacing: '0px',
          textDecoration: 'none',
          textCase: 'none',
        },
        type: 'typography',
      },
      heading2: {
        name: 'Heading 2',
        value: {
          fontFamily: 'Inter',
          fontWeight: '500',
          fontSize: '36px',
          lineHeight: '44px',
          letterSpacing: '0px',
          textDecoration: 'none',
          textCase: 'none',
        },
        type: 'typography',
      },
      heading3: {
        name: 'Heading 3',
        value: {
          fontFamily: 'Inter',
          fontWeight: '800',
          fontSize: '24px',
          lineHeight: '32px',
          letterSpacing: '0px',
          textDecoration: 'none',
          textCase: 'none',
        },
        type: 'typography',
      },
    },
    color: {
      primary: {
        name: 'Primary',
        value: '#0070f3',
        type: 'color',
      },
      secondary: {
        name: 'Secondary',
        value: '#ff0070',
        type: 'color',
      },
      tertiary: {
        name: 'Tertiary',
        value: '#00ff70',
        type: 'color',
      },
    },
    spacing: {
      small: {
        name: 'Small',
        value: 4,
        type: 'spacing',
      },
      medium: {
        name: 'Medium',
        value: 8,
        type: 'spacing',
      },
      large: {
        name: 'Large',
        value: 16,
        type: 'spacing',
      },
    },
    sizing: {
      small: {
        name: 'Small',
        value: 50,
        type: 'sizing',
      },
      medium: {
        name: 'Medium',
        value: 100,
        type: 'sizing',
      },
      large: {
        name: 'Large',
        value: 200,
        type: 'sizing',
      },
    },
    fontWeight: {
      normal: {
        name: 'Normal',
        value: '400',
        type: 'fontWeight',
      },
      medium: {
        name: 'Medium',
        value: '600',
        type: 'fontWeight',
      },
      bold: {
        name: 'Bold',
        value: '800',
        type: 'fontWeight',
      },
    },
    fontSize: {
      small: {
        name: 'Small',
        value: '12',
        type: 'fontSize',
      },
      medium: {
        name: 'Medium',
        value: '16',
        type: 'fontSize',
      },
      large: {
        name: 'Large',
        value: '24',
        type: 'fontSize',
      },
    },
    lineHeight: {
      small: {
        name: 'Small',
        value: '16px',
        type: 'lineHeight',
      },
      medium: {
        name: 'Medium',
        value: '24px',
        type: 'lineHeight',
      },
      large: {
        name: 'Large',
        value: '32px',
        type: 'lineHeight',
      },
    },
    borderWidth: {
      small: {
        name: 'Small',
        value: 1,
        type: 'borderWidth',
      },
      medium: {
        name: 'Medium',
        value: 2,
        type: 'borderWidth',
      },
      large: {
        name: 'Large',
        value: 4,
        type: 'borderWidth',
      },
    },
    borderRadius: {
      small: {
        name: 'Small',
        value: 4,
        type: 'borderRadius',
      },
      medium: {
        name: 'Medium',
        value: 8,
        type: 'borderRadius',
      },
      large: {
        name: 'Large',
        value: 16,
        type: 'borderRadius',
      },
    },
    boxShadow: {
      small: {
        name: 'Small',
        value: {
          offsetX: 5,
          offsetY: 5,
          spread: 5,
          radius: 0,
          color: 'rgba(0, 0, 0, 0.05)',
        },
        type: 'boxShadow',
      },
      medium: {
        name: 'Medium',
        value: {
          offsetX: 10,
          offsetY: 10,
          spread: 8,
          radius: 0,
          color: 'rgba(0, 0, 0, 0.1)',
        },
        type: 'boxShadow',
      },
      large: {
        name: 'Large',
        value: {
          offsetX: 20,
          offsetY: 20,
          spread: 10,
          radius: 0,
          color: 'rgba(0, 0, 0, 0.15)',
        },
        type: 'boxShadow',
      },
    },
    opacity: {
      '0': {
        name: '0',
        value: 0,
        type: 'opacity',
      },
      '25': {
        name: '25',
        value: 0.25,
        type: 'opacity',
      },
      '50': {
        name: '50',

        value: 0.5,
        type: 'opacity',
      },
      '75': {
        name: '75',
        value: 0.75,
        type: 'opacity',
      },
      '100': {
        name: '100',
        value: 1,
        type: 'opacity',
      },
    },
    layer: {
      base: {
        name: 'Base',
        value: 0,
        type: 'layer',
      },
      overlay: {
        name: 'Overlay',
        value: 1,
        type: 'layer',
      },
      modal: {
        name: 'Modal',
        value: 2,
        type: 'layer',
      },
      popover: {
        name: 'Popover',
        value: 3,
        type: 'layer',
      },
    },
    composition: {
      header: {
        name: 'Header',
        value: {
          border: '{border.small}',
          borderRadius: '{borderRadius.small}',
          boxShadow: '{boxShadow.small}',
          fill: '{color.primary}',
          spacing: '{spacing.medium}',
          typography: '{typography.heading1}',
        },
        type: 'composition',
      },
    },
    component: {
      button: {
        name: 'Button',
        value: {
          base: '{composition.header}',
          variants: {
            variant: {
              primary: {
                fill: '{color.primary}',
              },
              secondary: {
                fill: '{color.secondary}',
              },
              tertiary: {
                fill: '{color.tertiary}',
              },
            },
            size: {
              small: {
                spacing: '{spacing.small}',
              },
              medium: {
                spacing: '{spacing.medium}',
              },
              large: {
                spacing: '{spacing.large}',
              },
            },
          },
          defaultVariants: {
            variant: 'primary',
            size: 'medium',
          },
        },
        type: 'component',
      },
    },
  },
};

export const TOKEN_SET_2 = {
  name: 'Token Set 2',
  id: 'token-set-2',
  tokens: {
    color: {
      primary: {
        name: 'Primary',
        value: '#FF0000',
        type: 'color',
      },
      secondary: {
        name: 'Secondary',
        value: '#00FF00',
        type: 'color',
      },
      tertiary: {
        name: 'Tertiary',
        value: '#0000FF',
        type: 'color',
      },
    },
    spacing: {
      small: {
        name: 'Small',
        value: 50,
        type: 'spacing',
      },
      medium: {
        name: 'Medium',
        value: 100,
        type: 'spacing',
      },
      large: {
        name: 'Large',
        value: 150,
        type: 'spacing',
      },
    },
    fontFamily: {
      primary: {
        name: 'Primary',
        value: 'Comic Sans MS',
        type: 'fontFamily',
      },
      secondary: {
        name: 'Secondary',
        value: 'Arial',
        type: 'fontFamily',
      },
    },

    typography: {
      heading1: {
        name: 'Heading 1',
        value: {
          fontFamily: '{fontFamily.primary}',
          fontWeight: '{fontWeight.bold}',
          fontSize: '{fontSize.large}',
          lineHeight: '{lineHeight.large}',
        },
        type: 'typography',
      },
      heading2: {
        name: 'Heading 2',
        value: {
          fontFamily: '{fontFamily.primary}',
          fontWeight: '{fontWeight.bold}',
          fontSize: '{fontSize.medium}',
          lineHeight: '{lineHeight.medium}',
        },
        type: 'typography',
      },
      heading3: {
        name: 'Heading 3',
        value: {
          fontFamily: '{fontFamily.primary}',
          fontWeight: '{fontWeight.bold}',
          fontSize: '{fontSize.small}',
          lineHeight: '{lineHeight.small}',
        },
        type: 'typography',
      },
      body: {
        name: 'Body',
        value: {
          fontFamily: '{fontFamily.primary}',
          fontWeight: '{fontWeight.regular}',
          fontSize: '{fontSize.medium}',
          lineHeight: '{lineHeight.medium}',
        },
        type: 'typography',
      },
    },
    fontWeight: {
      regular: {
        name: 'Regular',
        value: '400',
        type: 'fontWeight',
      },
      bold: {
        name: 'Bold',
        value: '700',
        type: 'fontWeight',
      },
    },
    fontSize: {
      small: {
        name: 'Small',
        value: '24px',
        type: 'fontSize',
      },
      medium: {
        name: 'Medium',
        value: '48px',
        type: 'fontSize',
      },
      large: {
        name: 'Large',
        value: '64px',
        type: 'fontSize',
      },
    },
    lineHeight: {
      small: {
        name: 'Small',
        value: '16px',
        type: 'lineHeight',
      },
      medium: {
        name: 'Medium',
        value: '24px',
        type: 'lineHeight',
      },
      large: {
        name: 'Large',
        value: '32px',
        type: 'lineHeight',
      },
    },
    borderRadius: {
      small: {
        name: 'Small',
        value: 4,
        type: 'borderRadius',
      },
      medium: {
        name: 'Medium',
        value: 8,
        type: 'borderRadius',
      },
      large: {
        name: 'Large',
        value: 12,
        type: 'borderRadius',
      },
    },
    border: {
      small: {
        name: 'Small',
        value: {
          width: 1,
          style: 'solid',
          color: '{color.primary}',
        },
        type: 'border',
      },
      medium: {
        name: 'Medium',
        value: {
          width: 2,
          style: 'solid',
          color: '{color.primary}',
        },
        type: 'border',
      },
      large: {
        name: 'Large',
        value: {
          width: 4,
          style: 'solid',
          color: '{color.primary}',
        },
        type: 'border',
      },
    },
    boxShadow: {
      small: {
        name: 'Small',
        value: {
          offsetX: 5,
          offsetY: 5,
          spread: 5,
          radius: 0,
          color: 'rgba(65, 54, 0, 0.05)',
        },
        type: 'boxShadow',
      },
    },
  },
};
