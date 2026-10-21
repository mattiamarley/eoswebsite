'use client'

import { motion, type MotionValue } from 'framer-motion'

type Point = [number, number, number]
const project = ([x, z, y]: Point) => [420 + (x - z) * 30, 240 + (x + z) * 14 - y * 32]
const line = (points: Point[]) => points.map((p, i) => `${i ? 'L' : 'M'}${project(p).join(',')}`).join(' ')
const floor = (y: number) => line([[0,0,y],[9,0,y],[9,5,y],[0,5,y],[0,0,y]])
const foundations = [floor(0), floor(-.3), ...Array.from({length: 10}, (_, x) => line([[x,-2,0],[x,7,0]])), ...Array.from({length: 8}, (_, z) => line([[-2,z,0],[11,z,0]]))]
const structure = [floor(2), floor(4), ...[0,3,6,9].flatMap(x => [0,5].map(z => line([[x,z,0],[x,z,4]]))), ...[0,3,6,9].map(x => line([[x,0,4],[x,5,4]]))]
const envelope = [...Array.from({length: 19}, (_, i) => line([[i/2,0,0],[i/2,0,4]])), ...Array.from({length: 11}, (_, i) => line([[9,i/2,0],[9,i/2,4]])), floor(4.2), ...[1,3].map(y => line([[0,0,y],[9,0,y],[9,5,y]])), ...[1,2,3].map(z => line([[.8,z,4.25],[7.8,z,4.25]]))]

export function Blueprint({ progress, reduced = false, compact = false }: { progress?: MotionValue<number>[]; reduced?: boolean; compact?: boolean }) {
  return <svg className="blueprint" viewBox="100 35 720 460" fill="none" role="img" aria-label="Blueprint assonometrico di un edificio: fondazioni, telaio strutturale e facciate">
    <g stroke="currentColor" strokeWidth=".7" opacity=".12">
      {foundations.map((d,i) => <path d={d} key={i}/>)}
      {structure.map((d,i) => <path d={d} key={i}/>)}
      {envelope.map((d,i) => <path d={d} key={i}/>)}
    </g>
    {[foundations, structure, envelope].map((paths, group) => <g key={group} stroke={group === 2 ? 'var(--color-lavender-dark)' : 'currentColor'} strokeWidth={group === 0 ? '.8' : '1.35'} strokeLinejoin="round" strokeLinecap="round">
      {paths.map((d,i) => <motion.path key={i} d={d} style={{pathLength: reduced || !progress ? 1 : progress[group], opacity: group === 0 ? .4 : .85}}/>)}
    </g>) }
    {!compact && <g stroke="currentColor" strokeWidth=".65" opacity=".45">
      <path d="M242 358 L512 484 M237 349 L247 367 M507 475 L517 493 M712 373 L712 238 M707 373 L717 373 M707 238 L717 238"/>
      <path d="M192 229h55l48 27 M666 111h-73l-40 31" strokeDasharray="3 4"/>
      <g fill="currentColor" stroke="none" fontSize="9" fontFamily="monospace" letterSpacing="1.4"><text x="163" y="215">STRUTTURA / 01</text><text x="595" y="100">INVOLUCRO / 02</text><text x="716" y="307">H</text><text x="320" y="424" transform="rotate(25 320 424)">PROGETTAZIONE INTEGRATA</text></g>
    </g>}
  </svg>
}
