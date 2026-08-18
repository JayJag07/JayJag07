/**
 * Províncias, municípios e centralidades de Angola usados no auto-complete
 * da barra de pesquisa e nos filtros de localização.
 */

export const PROVINCES = [
  {
    name: 'Luanda',
    center: [-8.8383, 13.2344],
    zones: [
      'Talatona',
      'Kilamba',
      'Maianga',
      'Ingombota',
      'Miramar',
      'Benfica',
      'Camama',
      'Cacuaco',
      'Viana',
      'Zango',
      'Morro Bento',
      'Patriota',
      'Sequele',
      'Nova Vida',
      'Vila Alice',
      'Cassenda',
      'Golfe',
      'Mussulo',
    ],
  },
  { name: 'Benguela', center: [-12.5763, 13.4055], zones: ['Benguela Cidade', 'Lobito', 'Restinga', 'Catumbela', 'Baía Farta'] },
  { name: 'Huambo', center: [-12.7761, 15.7392], zones: ['Huambo Cidade', 'Caála', 'Bailundo', 'Académico'] },
  { name: 'Cabinda', center: [-5.5504, 12.2015], zones: ['Cabinda Cidade', 'Simulambuco', 'Malembo', 'Cabassango'] },
  { name: 'Huíla', center: [-14.9177, 13.4925], zones: ['Lubango', 'Arimba', 'Humpata', 'Matala'] },
  { name: 'Namibe', center: [-15.1961, 12.1522], zones: ['Moçâmedes', 'Praia Amélia', 'Tômbwa'] },
  { name: 'Malanje', center: [-9.5402, 16.341], zones: ['Malanje Cidade', 'Cangandala', 'Calandula'] },
  { name: 'Bengo', center: [-8.6167, 13.6667], zones: ['Caxito', 'Dande', 'Barra do Dande'] },
  { name: 'Cuanza Sul', center: [-11.2, 14.1167], zones: ['Sumbe', 'Porto Amboim', 'Gabela'] },
  { name: 'Cuanza Norte', center: [-9.3, 14.9], zones: ['Ndalatando', 'Cambambe', 'Lucala'] },
  { name: 'Uíge', center: [-7.6087, 15.0613], zones: ['Uíge Cidade', 'Negage', 'Songo'] },
  { name: 'Zaire', center: [-6.135, 12.3689], zones: ['Mbanza Kongo', 'Soyo', 'Nzeto'] },
  { name: 'Lunda Norte', center: [-7.3689, 20.8317], zones: ['Dundo', 'Lucapa'] },
  { name: 'Lunda Sul', center: [-9.6608, 20.3894], zones: ['Saurimo', 'Cacolo'] },
  { name: 'Moxico', center: [-11.7833, 19.9167], zones: ['Luena', 'Lumege'] },
  { name: 'Bié', center: [-12.3833, 16.9333], zones: ['Kuito', 'Andulo', 'Camacupa'] },
  { name: 'Cunene', center: [-16.7833, 15.0], zones: ['Ondjiva', 'Xangongo'] },
  { name: 'Cuando Cubango', center: [-14.6585, 17.6910], zones: ['Menongue', 'Cuito Cuanavale'] },
]

/** Lista plana usada pelo auto-complete: província + "Província, Zona". */
export const LOCATION_SUGGESTIONS = PROVINCES.flatMap((p) => [
  { label: p.name, province: p.name, zone: null, type: 'Província', center: p.center },
  ...p.zones.map((z) => ({
    label: `${z}, ${p.name}`,
    province: p.name,
    zone: z,
    type: 'Município / Centralidade',
    center: p.center,
  })),
])

export const PROVINCE_NAMES = PROVINCES.map((p) => p.name)

export function provinceCenter(name) {
  return PROVINCES.find((p) => p.name === name)?.center ?? [-8.8383, 13.2344]
}
