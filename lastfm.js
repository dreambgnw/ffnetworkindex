        /* --- Now Playing (Last.fm API) --- */
        const LASTFM_API_KEY = 'c854fb5e1feccdae09ecd2bd97801f75'; 
        const LASTFM_USER = 'shunature';

        let currentTrackId = "";
        let progressWidth = 0;
        let progressInterval;

        async function updateNowPlaying() {
            const titleEl = document.getElementById('np-title');
            const artistEl = document.getElementById('np-artist');
            const indicatorEl = document.getElementById('np-indicator');
            const visualizerEl = document.getElementById('np-visualizer');
            const progressContainer = document.getElementById('np-progress-container');
            const progressBox = document.getElementById('np-progress-bar');
            const iconEl = document.getElementById('np-icon');
            const artEl = document.getElementById('np-art');

            try {
                const res = await fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LASTFM_USER}&api_key=${LASTFM_API_KEY}&format=json&limit=1`);
                const data = await res.json();
                
                if (!data.recenttracks || !data.recenttracks.track || data.recenttracks.track.length === 0) return;

                const track = data.recenttracks.track[0];
                const isPlaying = track['@attr'] && track['@attr'].nowplaying === 'true';
                const trackId = track.name + track.artist['#text'];

                if (trackId !== currentTrackId) {
                    currentTrackId = trackId;
                    progressWidth = 0; 
                    progressBox.style.width = '0%';
                }

                titleEl.innerText = track.name;
                artistEl.innerText = track.artist['#text'];

                const artUrl = track.image.find(img => img.size === 'large')?.['#text'];
                if (artUrl && artUrl !== "") {
                    artEl.src = artUrl;
                    artEl.classList.remove('hidden');
                    iconEl.classList.add('hidden');
                } else {
                    artEl.classList.add('hidden');
                    iconEl.classList.remove('hidden');
                }

                if (isPlaying) {
                    indicatorEl.className = 'relative inline-flex rounded-full h-2 w-2 bg-orange-500 animate-pulse';
                    visualizerEl.classList.remove('opacity-0');
                    progressContainer.classList.remove('opacity-0');
                    
                    if (!progressInterval) {
                        progressInterval = setInterval(() => {
                            if (progressWidth < 100) {
                                progressWidth += 0.2;
                                progressBox.style.width = progressWidth + '%';
                            }
                        }, 1000);
                    }
                } else {
                    indicatorEl.className = 'relative inline-flex rounded-full h-2 w-2 bg-stone-700';
                    visualizerEl.classList.add('opacity-0');
                    progressContainer.classList.add('opacity-0');
                    if (progressInterval) {
                        clearInterval(progressInterval);
                        progressInterval = null;
                    }
                }
            } catch (e) {
                console.error('Last.fm Sync Failed:', e);
            }
        }
