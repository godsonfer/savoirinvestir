declare global {
    interface Window {
        YT: any;
        onYouTubeIframeAPIReady: () => void;
    }
}

export interface YouTubePlayer {
    playVideo: () => void
    pauseVideo: () => void
    seekTo: (seconds: number, allowSeekAhead: boolean) => void
    getCurrentTime: () => number
    getDuration: () => number
    mute: () => void
    unMute: () => void
    isMuted: () => boolean
    getPlayerState: () => number
    addEventListener: (event: string, listener: () => void) => void
}

export const loadYouTubeAPI = (): Promise<void> => {
    return new Promise((resolve) => {
        if (window.YT) {
            resolve();
            return;
        }

        window.onYouTubeIframeAPIReady = () => {
            resolve();
        };

        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    });
}

export const getYouTubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
}

export const createYouTubePlayer = (
    containerId: string,
    videoId: string
): Promise<YouTubePlayer> => {
    return new Promise((resolve) => {
        const player = new window.YT.Player(containerId, {
            videoId,
            playerVars: {
                autoplay: 0,
                controls: 0,
                modestbranding: 1,
                rel: 0,
                showinfo: 0,
                fs: 1,
                playsinline: 1,
            },
            events: {
                onReady: () => resolve(player),
            },
        });
    });
}

export const PlayerState = {
    UNSTARTED: -1,
    ENDED: 0,
    PLAYING: 1,
    PAUSED: 2,
    BUFFERING: 3,
    CUED: 5,
}; 
