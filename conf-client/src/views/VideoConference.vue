<template>
  <v-app>
    <v-container fluid>
      <v-layout wrap>
        <!-- Вывод видео пользователей -->
        <v-flex xs12 sm6 md4 lg3 v-for="video in remoteVideos" :key="video.id">
          <v-card>
            <video :ref="'remoteVideo-' + video.id" autoplay playsinline class="remote-video"></video>
          </v-card>
        </v-flex>
      </v-layout>

      <v-layout justify-center>
        <v-flex xs12 sm6 md4 lg3>
          <v-card>
            <video ref="localVideo" autoplay playsinline v-show="videoEnabled" class="local-video"></video>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <v-bottom-navigation fixed>
      <!-- Панель с органами управления -->
      <v-btn color="primary" @click="toggleAudio">
        {{ audioEnabled ? 'Disable' : 'Enable' }} Microphone
      </v-btn>
      <v-btn color="primary" @click="toggleVideo">
        {{ videoEnabled ? 'Disable' : 'Enable' }} Video
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

  
  <script>
  import SimplePeer from 'simple-peer';
  import io from 'socket.io-client';
  
  export default {
    data() {
      return {
        socket: null,
        roomId: null,
        localStream: null,
        localVideo: null,
        remoteVideos: null,
        videoEnabled: false,
        audioEnabled: false,
        peers: {},
      };
    },
    methods: {
      async getMedia() {
        try {
          this.localStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
          this.localVideo.srcObject = this.localStream;

          // Выключаем треки по умолчанию
          this.localStream.getVideoTracks().forEach((track) => {
            track.enabled = this.videoEnabled;
          });

          this.localStream.getAudioTracks().forEach((track) => {
            track.enabled = this.audioEnabled;
          });

        } catch (error) {
          console.error('Error getting user media', error);
        }
      },
      initSocket() {
        this.socket = io("https://localhost:3000");
        // Здесь вы можете добавить обработчики событий для сокета
        this.socket.on("join", this.onJoin);
        this.socket.on("signal", this.onSignal);
      },
      destroySocket() {
        if (this.socket) {
          this.socket.disconnect();
          this.socket = null;
        }
      },
      joinRoom() {
        this.socket.emit('join', this.roomId);
      },
      onJoin(socketId) {
        const peer = this.createPeer(socketId, true);
        peer.addStream(this.localStream);
      },
      createPeer(socketId, initiator) {
        const peer = new SimplePeer({
          initiator,
          stream: this.localStream,
          config: {
            iceServers: [
              { urls: 'stun:stun.l.google.com:19302' },
              { urls: 'stun:stun1.l.google.com:19302' },
            ],
          },
        });
  
        peer.on('signal', (data) => {
          this.socket.emit('signal', {
            to: socketId,
            from: this.socket.id,
            signal: data,
          });
        });
  
        peer.on('stream', (stream) => {
          const video = document.createElement('video');
          video.srcObject = stream;
          video.autoplay = true;
          video.playsinline = true;
          video.classList.add('remote-video');
          this.remoteVideos.appendChild(video);
        });
  
        return peer;
      },
      onSignal({ from, signal }) {
        let peer = this.peers[from];
        if (!peer) {
          peer = this.createPeer(from, false);
          this.peers[from] = peer;
        }
        peer.signal(signal);
      },


      async toggleVideo() {
        this.videoEnabled = !this.videoEnabled;

        if (!this.localStream) {
          await this.getMedia();
        }

        this.localStream.getVideoTracks().forEach((track) => {
          track.enabled = this.videoEnabled;
        });
      },

      async toggleAudio() {
        this.audioEnabled = !this.audioEnabled;

        if (!this.localStream) {
          await this.getMedia();
        }

        this.localStream.getAudioTracks().forEach((track) => {
          track.enabled = this.audioEnabled;
        });
      },
    },
    mounted() {
      this.localVideo = this.$refs.localVideo;
      this.remoteVideos = this.$refs.remoteVideos;
      this.roomId = this.$route.params.id;
   
      this.initSocket();

      // this.getMedia();

  
      this.joinRoom();
    },
    beforeUnmount() {
      this.hangup();
      this.destroySocket();
    },
  };
  </script>
    <style scoped>
    .video-container {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
    }

    .local-video,
    .remote-video {
      width: 50%;
      height: 50%;
      object-fit: cover;
      margin: 0.5rem;
    }
  </style>
