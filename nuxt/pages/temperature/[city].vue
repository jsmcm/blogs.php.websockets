<script setup>
import { io } from 'socket.io-client';

let { city } = useRoute().params;

const channelUrl  = "http://localhost";
const channelPort = "5000";
const channelName = city + "Event";

let messages = ref([]);

onMounted(() => {
  if (channelUrl != "" && channelPort != "") {
    const socket = io(channelUrl + ":" + channelPort);

    socket.on("connected", () => {
        console.log("Connected to node server, subscribing to channel: " + channelName);
        socket.emit("subscribe-from-temperature-page-in-nuxt", channelName);
    });

    socket.on(channelName, (data) => {
        messages.value.push(data);      
    });

  }

});

</script>

<template>
    <h1>Temperature Page: {{ city }}</h1>
    <p>Waiting for data from your back end server. It will show up below when we receive it:</p>

    <ul>
        <li v-for="(message, index) in messages" :key="index">{{ message }}</li>
    </ul>
</template>