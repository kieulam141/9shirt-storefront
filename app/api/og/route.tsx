import { ImageResponse } from 'next/og'
import { DEFAULT_SOCIAL_PRODUCT_IMAGE, SOCIAL_IMAGE_HEIGHT, SOCIAL_IMAGE_WIDTH } from '@/lib/seo'

export const runtime = 'edge'

const MAX_TITLE_LENGTH = 76
const MAX_SUBTITLE_LENGTH = 108

function trimText(value: string | null, maxLength: number): string {
  if (!value) return ''
  return value.length > maxLength ? `${value.slice(0, maxLength - 1)}...` : value
}

export function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = trimText(searchParams.get('title') || '9shirt áo Hawaii cá tính', MAX_TITLE_LENGTH)
  const subtitle = trimText(
    searchParams.get('subtitle') || 'Áo Hawaii cá tính, quần short và outfit hè giao từ Hà Nội.',
    MAX_SUBTITLE_LENGTH,
  )
  const image = searchParams.get('image') || DEFAULT_SOCIAL_PRODUCT_IMAGE
  const price = searchParams.get('price')
  const eyebrow = '9SHIRT | CÔNG TY TNHH 9FASHION'
  const cta = 'Mua theo phong cách'

  return new ImageResponse(
    (
      <div
        style={{
          alignItems: 'stretch',
          background: 'linear-gradient(135deg, #061128 0%, #10245a 54%, #071425 100%)',
          color: '#f8fbff',
          display: 'flex',
          fontFamily: 'Arial, sans-serif',
          height: '100%',
          justifyContent: 'space-between',
          overflow: 'hidden',
          padding: 58,
          position: 'relative',
          width: '100%',
        }}
      >
        <div
          style={{
            background: 'radial-gradient(circle, rgba(255,154,47,0.22), rgba(255,154,47,0) 62%)',
            height: 560,
            left: -170,
            position: 'absolute',
            top: -210,
            width: 560,
          }}
        />
        <div
          style={{
            background: 'radial-gradient(circle, rgba(69,139,255,0.22), rgba(69,139,255,0) 64%)',
            bottom: -220,
            height: 620,
            position: 'absolute',
            right: -140,
            width: 620,
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: 570, zIndex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <div
              style={{
                alignItems: 'center',
                border: '1px solid rgba(255,154,47,0.44)',
                borderRadius: 999,
                color: '#ffd38a',
                display: 'flex',
                fontSize: 24,
                fontWeight: 800,
                letterSpacing: 3,
                padding: '13px 20px',
                textTransform: 'uppercase',
                width: 'max-content',
              }}
            >
              {eyebrow}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ fontSize: 72, fontWeight: 900, letterSpacing: 0, lineHeight: 0.9 }}>
                {title}
              </div>
              <div style={{ color: '#b9c8ec', fontSize: 30, fontWeight: 700, lineHeight: 1.22 }}>
                {subtitle}
              </div>
            </div>
          </div>

          <div style={{ alignItems: 'center', display: 'flex', gap: 18 }}>
            <div
              style={{
                background: '#ff9a2f',
                borderRadius: 999,
                color: '#061128',
                fontSize: 26,
                fontWeight: 900,
                padding: '18px 26px',
                textTransform: 'uppercase',
              }}
            >
              {cta}
            </div>
            {price ? (
              <div style={{ color: '#ff9a2f', fontSize: 40, fontWeight: 900 }}>
                {price}
              </div>
            ) : null}
          </div>
        </div>

        <div
          style={{
            alignItems: 'center',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.1), rgba(255,255,255,0.03))',
            border: '1px solid rgba(255,255,255,0.16)',
            borderRadius: 40,
            boxShadow: '0 34px 90px rgba(0,0,0,0.38)',
            display: 'flex',
            height: 514,
            justifyContent: 'center',
            overflow: 'hidden',
            padding: 18,
            transform: 'rotate(1.5deg)',
            width: 430,
            zIndex: 1,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt=""
            src={image}
            style={{
              borderRadius: 28,
              height: '100%',
              objectFit: 'cover',
              width: '100%',
            }}
          />
        </div>
      </div>
    ),
    {
      width: SOCIAL_IMAGE_WIDTH,
      height: SOCIAL_IMAGE_HEIGHT,
    },
  )
}
