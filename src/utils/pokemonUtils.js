export const DEFAULT_AVATAR = '../public/Ash.png'

export const INITIAL_FAVORITES = [25, 6, 131]

export const getTypeInfo = (type) => {
  const typeMap = {
    fire: { class: 'fuego', text: 'FUEGO' },
    water: { class: 'agua', text: 'AGUA' },
    grass: { class: 'planta', text: 'PLANTA' },
    electric: { class: 'electrico', text: 'ELÉCTRICO' },
    ice: { class: 'hielo', text: 'HIELO' },
    flying: { class: 'volador', text: 'VOLADOR' },
    psychic: { class: 'psiquico', text: 'PSÍQUICO' },
    poison: { class: 'veneno', text: 'VENENO' },
    ground: { class: 'tierra', text: 'TIERRA' },
    rock: { class: 'roca', text: 'ROCA' },
    bug: { class: 'bicho', text: 'BICHO' },
    ghost: { class: 'fantasma', text: 'FANTASMA' },
    dark: { class: 'siniestro', text: 'SINIESTRO' },
    dragon: { class: 'dragon', text: 'DRAGÓN' },
    steel: { class: 'acero', text: 'ACERO' },
    fairy: { class: 'hada', text: 'HADA' },
    normal: { class: 'normal', text: 'NORMAL' },
    fighting: { class: 'lucha', text: 'LUCHA' }
  }
  return typeMap[type] || { class: type, text: type.toUpperCase() }
}
