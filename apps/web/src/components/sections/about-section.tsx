import Image from 'next/image'
import { Shield, Award, Heart, Sparkles } from 'lucide-react'

const differentials = [
  {
    icon: Shield,
    title: 'Segurança & Higiene',
    description: 'Materiais descartáveis e esterilizados em cada atendimento, seguindo rigorosos protocolos de biossegurança.',
  },
  {
    icon: Award,
    title: 'Profissionais Certificadas',
    description: 'Equipe com cursos de especialização reconhecidos e atualização contínua nas últimas técnicas.',
  },
  {
    icon: Heart,
    title: 'Atendimento Personalizado',
    description: 'Cada cliente recebe um diagnóstico individual. Cuidamos das suas necessidades únicas com atenção e carinho.',
  },
  {
    icon: Sparkles,
    title: 'Produtos Premium',
    description: 'Utilizamos apenas marcas renomadas e produtos de alta performance para garantir os melhores resultados.',
  },
]

export function AboutSection() {
  return (
    <section className="py-20 bg-[#F6E6E6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
        {/* Visual */}
        <div className="relative order-2 lg:order-1">
          <div className="aspect-[4/3] rounded-3xl relative overflow-hidden">
            <Image
              src="https://res.cloudinary.com/dqewxdbfx/image/upload/v1780018047/foto_da_fachada_tssmkt.jpg"
              alt="La Belle Infiní — Fachada"
              fill
              className="object-cover"
            />
          </div>

          {/* Experience badge */}
          <div className="absolute -bottom-5 -right-5 bg-[#1E1E1E] text-white rounded-2xl p-5 shadow-xl">
            <p
              className="text-3xl font-light"
              style={{ fontFamily: 'var(--font-cormorant)' }}
            >
              5+
            </p>
            <p
              className="text-xs tracking-widest uppercase text-white/60 mt-0.5"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              anos de experiência
            </p>
          </div>
        </div>

        {/* Text */}
        <div className="order-1 lg:order-2">
          <p
            className="text-[#C89B7B] text-xs tracking-[0.5em] uppercase mb-4"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            Sobre a Clínica
          </p>
          <h2
            className="text-4xl lg:text-5xl font-light text-[#1E1E1E] leading-tight mb-6"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            Beleza que transforma,
            <br />
            <em className="not-italic text-[#C89B7B]">cuidado que permanece</em>
          </h2>
          <p
            className="text-[#7A5C52]/80 text-sm leading-relaxed mb-8"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            A La Belle Infiní é um espaço completo de beleza e bem-estar em Ingleses, Florianópolis.
            Oferecemos maquiagem, unhas, bronzeamento, estética e muito mais — tudo em um único lugar,
            com profissionais dedicadas a realçar a sua beleza com carinho e excelência.
          </p>

          <div className="grid sm:grid-cols-2 gap-5">
            {differentials.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#C89B7B]/15 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon size={16} className="text-[#C89B7B]" />
                </div>
                <div>
                  <h4
                    className="text-sm font-semibold text-[#1E1E1E] mb-1"
                    style={{ fontFamily: 'var(--font-playfair)' }}
                  >
                    {title}
                  </h4>
                  <p
                    className="text-xs text-[#7A5C52]/70 leading-relaxed"
                    style={{ fontFamily: 'var(--font-poppins)' }}
                  >
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
