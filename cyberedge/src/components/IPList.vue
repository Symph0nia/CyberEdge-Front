<template>
  <div class="bg-gray-800 p-6 rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-6">{{ title }}</h2>
    <div class="mb-6 flex">
      <input v-model="newIP" class="shadow appearance-none border-2 border-gray-700 rounded w-full py-3 px-4 bg-gray-900 text-white leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 transition duration-300" placeholder="添加 IP 地址">
      <button @click="addIP" class="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 ml-3 transform hover:scale-105 transition duration-300">添加 ➕</button>
    </div>
    <table class="min-w-full bg-gray-800">
      <thead>
      <tr>
        <th class="py-3 px-4 border-b-2 border-gray-700 text-left">IP 地址</th>
        <th class="py-3 px-4 border-b-2 border-gray-700 text-left">操作</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="ip in list" :key="ip" class="hover:bg-gray-700 transition duration-300">
        <td class="py-3 px-4 border-b border-gray-700 text-left">{{ ip }}</td>
        <td class="py-3 px-4 border-b border-gray-700 text-left">
          <button @click="removeIP(ip)" class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transform hover:scale-105 transition duration-300">移除 🗑️</button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'IPList',
  props: {
    title: String,
    list: Array
  },
  emits: ['add', 'remove'],
  setup(props, { emit }) {
    const newIP = ref('');

    const addIP = () => {
      if (newIP.value) {
        emit('add', newIP.value);
        newIP.value = '';
      }
    };

    const removeIP = (ip) => {
      emit('remove', ip);
    };

    return { newIP, addIP, removeIP };
  }
};
</script>
