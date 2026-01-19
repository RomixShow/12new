import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import DynamicForm from '../components/DynamicForm';
import LiquidEther from '../components/LiquidEther';
import Marquee from 'react-fast-marquee';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function getBlockValue(block, key, lang) {
  if (lang === 'en' && block[`${key}_en`]) {
    return block[`${key}_en`];
  }
  return block[key];
}

export default function DynamicPage({ slugOverride, fallback }) {
  const params = useParams();
  const slug = slugOverride || params.slug;
  const { i18n } = useTranslation();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API}/pages-dynamic/${slug}`);
        setPage(response.data);
      } catch (error) {
        console.error('Failed to fetch dynamic page', error);
        setPage(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, [slug]);

  const blocks = useMemo(() => page?.blocks || [], [page]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-white/60">Loading...</div>
      </div>
    );
  }

  if (!page) {
    if (fallback) {
      return fallback;
    }
    return (
      <div className="min-h-screen pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-white/60">Page not found.</div>
      </div>
    );
  }

  const firstBlock = blocks[0];
  const hasFullBleedHero = page?.full_width && firstBlock?.type === 'hero' && firstBlock?.full_bleed;

  return (
    <div className={`min-h-screen pb-24 ${hasFullBleedHero ? 'pt-0' : 'pt-28'}`}>
      <div className="space-y-12">
        {!page.hide_title && (
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <h1 className="text-4xl md:text-6xl font-black font-heading text-white tracking-tight">
              {i18n.language === 'en' && page.title_en ? page.title_en : page.title}
            </h1>
          </div>
        )}

        {blocks.map((block, index) => {
          const isFullBleed = Boolean(block.full_bleed) || block.type === 'marquee';
          if (page.full_width && isFullBleed) {
            return (
              <div key={block.id || block._id || index} className="w-full">
                <BlockRenderer block={block} lang={i18n.language} />
              </div>
            );
          }
          return (
            <div key={block.id || block._id || index} className="max-w-7xl mx-auto px-4 md:px-8">
              <BlockRenderer block={block} lang={i18n.language} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BlockRenderer({ block, lang }) {
  switch (block.type) {
    case 'hero':
      return <HeroBlock block={block} lang={lang} />;
    case 'text':
      return <TextBlock block={block} lang={lang} />;
    case 'image':
      return <ImageBlock block={block} lang={lang} />;
    case 'gallery':
      return <GalleryBlock block={block} />;
    case 'video':
      return <VideoBlock block={block} lang={lang} />;
    case 'form':
      return <FormBlock block={block} lang={lang} />;
    case 'cards':
      return <CardsBlock block={block} lang={lang} />;
    case 'stats':
      return <StatsBlock block={block} lang={lang} />;
    case 'logo_grid':
      return <LogoGridBlock block={block} />;
    case 'cta':
      return <CtaBlock block={block} lang={lang} />;
    case 'list':
      return <ListBlock block={block} lang={lang} />;
    case 'collection':
      return <CollectionBlock block={block} lang={lang} />;
    case 'html':
      return <HtmlBlock block={block} lang={lang} />;
    case 'marquee':
      return <MarqueeBlock block={block} />;
    case 'spacer':
      return <SpacerBlock block={block} />;
    default:
      return null;
  }
}

function HeroBlock({ block, lang }) {
  const title = getBlockValue(block, 'title', lang);
  const subtitle = getBlockValue(block, 'subtitle', lang);
  const ctaLabel = getBlockValue(block, 'cta_label', lang);
  const backgroundImage = block.background_image;
  const backgroundVideo = block.background_video;
  const useLiquid = Boolean(block.use_liquid);
  const liquidColors = Array.isArray(block.liquid_colors) && block.liquid_colors.length
    ? block.liquid_colors
    : ["#e70d0d", "#850000", "#ea6d57"];
  const liquidSettings = block.liquid_settings || {};
  const isFullBleed = Boolean(block.full_bleed);
  const ctaIsExternal = block.cta_href?.startsWith('http');

  return (
    <section
      className={`relative overflow-hidden ${isFullBleed ? 'flex items-center justify-center' : 'rounded-3xl border border-white/10 bg-black/40 pt-20 sm:pt-24'}`}
      style={isFullBleed ? { minHeight: 'calc(100svh / var(--site-zoom, 1))' } : undefined}
    >
      {useLiquid && (
        <div className="absolute inset-0 z-0">
          <LiquidEther
            colors={liquidColors}
            mouseForce={liquidSettings.mouseForce ?? 20}
            cursorSize={liquidSettings.cursorSize ?? 100}
            resolution={liquidSettings.resolution ?? 0.5}
            dt={liquidSettings.dt ?? 0.014}
            BFECC={liquidSettings.BFECC ?? true}
            isViscous={liquidSettings.isViscous ?? false}
            viscous={liquidSettings.viscous ?? 30}
            iterationsViscous={liquidSettings.iterationsViscous ?? 32}
            iterationsPoisson={liquidSettings.iterationsPoisson ?? 32}
            isBounce={liquidSettings.isBounce ?? false}
            autoDemo={liquidSettings.autoDemo ?? true}
            autoSpeed={liquidSettings.autoSpeed ?? 0.5}
            autoIntensity={liquidSettings.autoIntensity ?? 2.2}
            takeoverDuration={liquidSettings.takeoverDuration ?? 0.25}
            autoResumeDelay={liquidSettings.autoResumeDelay ?? 1000}
            autoRampDuration={liquidSettings.autoRampDuration ?? 0.6}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      )}
      {(backgroundImage || backgroundVideo) && (
        <div className="absolute inset-0">
          {backgroundVideo ? (
            <video className="w-full h-full object-cover opacity-50" src={backgroundVideo} autoPlay muted loop />
          ) : (
            <img className="w-full h-full object-cover opacity-40" src={backgroundImage} alt="" />
          )}
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/70" />
      <div className={`relative z-10 ${isFullBleed ? 'max-w-[900px] mx-auto px-4 md:px-8 text-center space-y-6' : 'p-10 md:p-16 space-y-6'}`}>
        {title && <h2 className="text-6xl md:text-8xl lg:text-9xl font-black font-heading text-white">{title}</h2>}
        {subtitle && <p className="text-white/70 text-2xl md:text-3xl">{subtitle}</p>}
        {ctaLabel && block.cta_href && (
          ctaIsExternal ? (
            <a href={block.cta_href} className="inline-flex items-center px-6 py-3 rounded-full bg-[#E11D2E] text-white">
              {ctaLabel}
            </a>
          ) : (
            <Link to={block.cta_href} className="inline-flex items-center px-6 py-3 rounded-full bg-[#E11D2E] text-white">
              {ctaLabel}
            </Link>
          )
        )}
      </div>
    </section>
  );
}

function TextBlock({ block, lang }) {
  const heading = getBlockValue(block, 'heading', lang);
  const body = getBlockValue(block, 'body', lang);
  return (
    <section className="space-y-4">
      {heading && <h3 className="text-2xl md:text-3xl font-bold font-heading text-white">{heading}</h3>}
      {body && <p className="text-white/70 whitespace-pre-line">{body}</p>}
    </section>
  );
}

function MarqueeBlock({ block }) {
  const items = Array.isArray(block.items) ? block.items : [];
  if (!items.length) return null;
  const repeatCount = items.length < 8 ? 3 : 2;
  const repeatedItems = Array.from({ length: repeatCount }, () => items).flat();
  return (
    <section className="border-y border-white/10 bg-black/40 h-[120px] flex items-center">
      <Marquee gradient={false} speed={40} pauseOnHover>
        {repeatedItems.map((item, index) => {
          const image = item.image_url || item.url;
          if (!image) return null;
          const content = (
            <div className="h-[110px] p-[5px] flex items-center justify-center">
              <img src={image} alt="" className="h-full object-contain opacity-70" />
            </div>
          );
          return (
            <div
              key={`${image}-${index}`}
              style={{ marginLeft: 'clamp(4px, 1.5vw, 16px)', marginRight: 'clamp(4px, 1.5vw, 16px)' }}
            >
              {item.link ? (
                <a href={item.link} target="_blank" rel="noreferrer">
                  {content}
                </a>
              ) : content}
            </div>
          );
        })}
      </Marquee>
    </section>
  );
}

function ImageBlock({ block, lang }) {
  const caption = getBlockValue(block, 'caption', lang);
  if (!block.url) return null;
  return (
    <figure className="space-y-4">
      <img src={block.url} alt={caption || ''} className="w-full rounded-2xl border border-white/10" />
      {caption && <figcaption className="text-white/60 text-sm">{caption}</figcaption>}
    </figure>
  );
}

function GalleryBlock({ block }) {
  const images = Array.isArray(block.images) ? block.images : [];
  if (!images.length) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {images.map((url) => (
        <img key={url} src={url} alt="" className="w-full h-60 object-cover rounded-2xl border border-white/10" />
      ))}
    </div>
  );
}

function VideoBlock({ block, lang }) {
  const title = getBlockValue(block, 'title', lang);
  if (!block.url) return null;
  const isYouTube = block.source === 'youtube' || /youtube\.com|youtu\.be/.test(block.url || '');
  const getYouTubeUrl = (url) => {
    if (!url) return url;
    if (url.includes('embed/')) return url;
    const shortMatch = url.match(/youtu\.be\/([^?]+)/);
    if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
    const match = url.match(/v=([^&]+)/);
    if (match) return `https://www.youtube.com/embed/${match[1]}`;
    return url;
  };
  return (
    <div className="space-y-4">
      {title && <h3 className="text-2xl font-bold font-heading text-white">{title}</h3>}
      {isYouTube ? (
        <div className="relative w-full pb-[56.25%]">
          <iframe
            title={title || 'video'}
            src={getYouTubeUrl(block.url)}
            className="absolute inset-0 w-full h-full rounded-2xl border border-white/10"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <video className="w-full rounded-2xl border border-white/10" controls src={block.url} />
      )}
    </div>
  );
}

function FormBlock({ block, lang }) {
  if (!block.form_slug) return null;
  return (
    <div className="glass rounded-3xl p-6 md:p-8">
      <DynamicForm slug={block.form_slug} lang={lang} />
    </div>
  );
}

function SpacerBlock({ block }) {
  const size = block.size || 32;
  return <div style={{ height: size }} />;
}

function CardsBlock({ block, lang }) {
  const title = getBlockValue(block, 'title', lang);
  const items = Array.isArray(block.items) ? block.items : [];
  return (
    <section className="space-y-6">
      {title && <h3 className="text-2xl md:text-3xl font-bold font-heading text-white">{title}</h3>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, index) => {
          const itemTitle = getBlockValue(item, 'title', lang);
          const itemDesc = getBlockValue(item, 'description', lang);
          return (
            <div key={`${itemTitle}-${index}`} className="glass rounded-2xl p-5 space-y-3">
              {item.icon_url && (
                <img src={item.icon_url} alt="" className="h-10 w-10 object-contain" />
              )}
              {item.image_url && (
                <img src={item.image_url} alt="" className="w-full h-40 object-cover rounded-xl" />
              )}
              {itemTitle && <h4 className="text-lg font-bold text-white">{itemTitle}</h4>}
              {itemDesc && <p className="text-white/70 text-sm">{itemDesc}</p>}
              {item.link && (
                item.link.startsWith('http') ? (
                  <a href={item.link} className="text-sm text-[#E11D2E]">Learn more</a>
                ) : (
                  <Link to={item.link} className="text-sm text-[#E11D2E]">Learn more</Link>
                )
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function StatsBlock({ block, lang }) {
  const items = Array.isArray(block.items) ? block.items : [];
  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((item, index) => {
        const label = getBlockValue(item, 'label', lang);
        return (
          <div key={`${item.value}-${index}`} className="glass rounded-2xl p-4 text-center space-y-2">
            <div className="text-2xl md:text-3xl font-black text-white">
              {item.value}
              {item.suffix || ''}
            </div>
            {label && <div className="text-white/60 text-sm">{label}</div>}
          </div>
        );
      })}
    </section>
  );
}

function LogoGridBlock({ block }) {
  const items = Array.isArray(block.items) ? block.items : [];
  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
      {items.map((item, index) => {
        const image = item.image_url || item.url;
        if (!image) return null;
        const content = (
          <img src={image} alt="" className="w-full h-16 object-contain opacity-80" />
        );
        return (
          <div key={`${image}-${index}`} className="glass rounded-2xl p-4 flex items-center justify-center">
            {item.link ? (
              <a href={item.link} target="_blank" rel="noreferrer">
                {content}
              </a>
            ) : content}
          </div>
        );
      })}
    </section>
  );
}

function CtaBlock({ block, lang }) {
  const title = getBlockValue(block, 'title', lang);
  const body = getBlockValue(block, 'body', lang);
  const button = getBlockValue(block, 'button_label', lang);
  const background = block.background_image;
  const isExternal = block.button_href?.startsWith('http');
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 p-8 md:p-12 bg-black/40">
      {background && (
        <img src={background} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
      )}
      <div className="relative z-10 space-y-4">
        {title && <h3 className="text-2xl md:text-4xl font-bold font-heading text-white">{title}</h3>}
        {body && <p className="text-white/70">{body}</p>}
        {button && block.button_href && (
          isExternal ? (
            <a href={block.button_href} className="inline-flex items-center px-6 py-3 rounded-full bg-[#E11D2E] text-white">
              {button}
            </a>
          ) : (
            <Link to={block.button_href} className="inline-flex items-center px-6 py-3 rounded-full bg-[#E11D2E] text-white">
              {button}
            </Link>
          )
        )}
      </div>
    </section>
  );
}

function ListBlock({ block, lang }) {
  const title = getBlockValue(block, 'title', lang);
  const items = lang === 'en' && Array.isArray(block.items_en) && block.items_en.length ? block.items_en : block.items || [];
  return (
    <section className="space-y-4">
      {title && <h3 className="text-2xl md:text-3xl font-bold font-heading text-white">{title}</h3>}
      <ul className="space-y-2 text-white/70 list-disc list-inside">
        {items.map((item, index) => (
          <li key={`${item}-${index}`}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

function HtmlBlock({ block, lang }) {
  const html = lang === 'en' && block.html_en ? block.html_en : block.html;
  if (!html) return null;
  return (
    <section className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
  );
}

function getLocalizedItemValue(item, field, lang) {
  if (lang === 'en' && item?.[`${field}_en`]) {
    return item[`${field}_en`];
  }
  return item?.[field];
}

function CollectionBlock({ block, lang }) {
  const [items, setItems] = useState([]);
  const title = getBlockValue(block, 'title', lang);
  const limit = block.limit ? Number(block.limit) : 0;

  useEffect(() => {
    const fetchItems = async () => {
      if (!block.collection) return;
      try {
        const response = await axios.get(`${API}/${block.collection}?lang=${lang}`);
        const data = Array.isArray(response.data) ? response.data : [];
        setItems(limit ? data.slice(0, limit) : data);
      } catch (error) {
        console.error('Failed to fetch collection', error);
      }
    };
    fetchItems();
  }, [block.collection, lang, limit]);

  if (!block.collection) return null;

  return (
    <section className="space-y-6">
      {title && <h3 className="text-2xl md:text-3xl font-bold font-heading text-white">{title}</h3>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => {
          const name = getLocalizedItemValue(item, 'name', lang) || getLocalizedItemValue(item, 'title', lang);
          const desc = getLocalizedItemValue(item, 'description', lang) || getLocalizedItemValue(item, 'excerpt', lang);
          const image = item.image_url || item.logo_url;
          const slug = item.slug;
          const detailPrefix = block.detail_prefix || '';
          const link = detailPrefix && slug ? `${detailPrefix}/${slug}` : null;
          const content = (
            <div className="glass rounded-2xl overflow-hidden">
              {image && <img src={image} alt={name || ''} className="w-full h-44 object-cover" />}
              <div className="p-4 space-y-2">
                {name && <h4 className="text-lg font-bold text-white">{name}</h4>}
                {desc && <p className="text-white/70 text-sm">{desc}</p>}
              </div>
            </div>
          );
          return (
            <div key={item.id || slug}>
              {link ? (
                <Link to={link}>{content}</Link>
              ) : (
                content
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
