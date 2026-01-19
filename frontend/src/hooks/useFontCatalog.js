import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const FALLBACK_FONTS = [
  { family: 'Roboto', weight: 400, url: '/fonts/Roboto-Regular.ttf' },
  { family: 'Open Sans', weight: 400, url: '/fonts/OpenSans-Regular.ttf' },
  { family: 'Montserrat', weight: 400, url: '/fonts/Montserrat-Regular.ttf' },
  { family: 'Inter', weight: 400, url: '/fonts/Inter-Regular.ttf' },
  { family: 'Lato', weight: 400, url: '/fonts/Lato-Regular.ttf' },
  { family: 'Poppins', weight: 400, url: '/fonts/Poppins-Regular.ttf' },
  { family: 'Nunito', weight: 400, url: '/fonts/Nunito-Regular.ttf' },
  { family: 'Source Sans 3', weight: 400, url: '/fonts/SourceSans3-Regular.ttf' },
  { family: 'Fira Sans', weight: 400, url: '/fonts/FiraSans-Regular.ttf' },
  { family: 'Rubik', weight: 400, url: '/fonts/Rubik-Regular.ttf' },
  { family: 'Arial', weight: 400, url: null },
];

const loadedFamilies = new Set();

export function useFontCatalog() {
  const [fonts, setFonts] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const response = await axios.get(`${API}/fonts`);
        const list = Array.isArray(response.data) && response.data.length > 0 ? response.data : FALLBACK_FONTS;
        if (isMounted) {
          setFonts(list);
        }
        list.forEach((font) => {
          if (!font.url || loadedFamilies.has(`${font.family}:${font.weight}`)) return;
          const face = new FontFace(font.family, `url(${font.url})`, { weight: String(font.weight || 400) });
          face.load().then(() => {
            document.fonts.add(face);
            loadedFamilies.add(`${font.family}:${font.weight}`);
          }).catch(() => {});
        });
      } catch (error) {
        if (isMounted) {
          setFonts(FALLBACK_FONTS);
        }
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const families = useMemo(() => {
    const unique = new Set();
    fonts.forEach((font) => unique.add(font.family));
    return Array.from(unique).sort();
  }, [fonts]);

  return { fonts, families };
}
