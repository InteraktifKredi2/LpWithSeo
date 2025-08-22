document.addEventListener('DOMContentLoaded', () => {
    /* ---------- FAQ (erişilebilir) ---------- */
    document.querySelectorAll('.faq .head').forEach(h => {
        h.setAttribute('tabindex', '0');
        const toggle = () => {
            const item = h.closest('.item');
            item.classList.toggle('active');
            const b = item.querySelector('.body');
            b.style.display = item.classList.contains('active') ? 'block' : 'none';
        };
        h.addEventListener('click', toggle);
        h.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
        });
    });

    /* ---------- "Daha fazla göster" ---------- */
    const more = document.querySelector('.moreFAQ');
    if (more) {
        more.addEventListener('click', () => {
            document.querySelectorAll('.hiddenFAQ').forEach(x => x.style.display = 'block');
            more.remove();
        }, { once: true });
    }

    /* ---------- YouTube URL -> Embed ---------- */
    function toEmbed(url) {
        try {
            const u = new URL(url);
            let id = '';
            if (u.pathname.startsWith('/shorts/')) {
                // /shorts/ID veya /shorts/ID/anything
                id = u.pathname.split('/shorts/')[1].split('/')[0];
            } else if (u.hostname.includes('youtu.be')) {
                id = u.pathname.replace(/^\//, '').split('/')[0];
            } else if (u.pathname === '/watch') {
                id = u.searchParams.get('v') || '';
            } else if (u.pathname.startsWith('/embed/')) {
                return url.includes('?') ? url : (url + '?autoplay=1');
            } else {
                id = (u.pathname.split('/').filter(Boolean).pop() || '').trim();
            }
            return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1`;
        } catch {
            return url;
        }
    }

    /* ---------- Video Kartları: kutu sabit, içerik sığdır ---------- */
    document.querySelectorAll('.video-card').forEach(card => {
        // 1) Kutu oranını belirle (poster boyutundan ya da data-thumb-ratio’dan)
        let thumbRatio = card.getAttribute('data-thumb-ratio');
        if (!thumbRatio) {
            const img = card.querySelector('img');
            if (img) {
                const w = parseInt(img.getAttribute('width') || 0, 10);
                const h = parseInt(img.getAttribute('height') || 0, 10);
                if (w > 0 && h > 0) thumbRatio = `${w}/${h}`;
            }
        }
        card.style.setProperty('--card-ratio', thumbRatio || '1/1'); // CSS: aspect-ratio: var(--card-ratio)

        // 2) Embed kaynağını hazırla
        const raw = card.getAttribute('data-src') || '';
        const src = toEmbed(raw);

        // 3) Tıklayınca (veya Enter/Space) posteri kaldırıp iframi aynı alana yerleştir
        const play = () => {
            const iframe = document.createElement('iframe');
            iframe.src = src;
            iframe.allow = 'autoplay; encrypted-media; picture-in-picture';
            iframe.setAttribute('allowfullscreen', '');
            iframe.title = 'Video oynatıcı';
            iframe.loading = 'lazy';
            // Yükseklik arttırmamak için boyutu CSS belirliyor: position:absolute; inset:0
            card.innerHTML = '';
            card.appendChild(iframe);
        };

        card.addEventListener('click', play, { once: true });
        // Klavye ile oynatmayı da destekle
        card.setAttribute('tabindex', '0');
        card.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); play(); }
        }, { once: true });
    });
});