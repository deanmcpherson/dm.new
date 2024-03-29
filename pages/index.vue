<template>
  <div class="p-6">
    <div class="w-[600px] max-w-full mx-auto">
      <h1 class="mb-2 font-extrabold text-xl">
        Get a unique dm.new link.
      </h1>
      <h2 class="mb-4">
        A quick way for people to slide in your X dm's. 100% free. 📩
      </h2>
      <p class="mb-4">
        Examples:
        <UButton
          to="https://dm.new/tim"
          target="_blank"
          variant="link"
          :padded="false"
        >
          dm.new/tim
        </UButton>
        •
        <UButton
          to="https://dm.new/steven"
          target="_blank"
          variant="link"
          :padded="false"
        >
          dm.new/steven
        </UButton>
      </p>
      <UCard>
        <UForm
          :schema="UrlFormSchema"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
        >
          <!-- url -->
          <UFormGroup
            label="Enter the URL you want eg. tim"
            name="url"
          >
            <UInput
              v-model="state.url"
              placeholder="tim"
              :ui="{
                leading: {
                  padding: {
                    sm: 'ps-[4.75rem]'
                  }
                }
              }"
            >
              <template #leading>
                <span>dm.new/</span>
              </template>
            </UInput>
          </UFormGroup>

          <!-- username -->
          <UFormGroup
            label="Your X username (where to send DM's)"
            name="username"
          >
            <UInput
              v-model="state.username"
              placeholder="timb03"
              :ui="{
                leading: {
                  padding: {
                    sm: 'ps-[3.85rem]'
                  }
                }
              }"
            >
              <template #leading>
                <span>x.com/</span>
              </template>
            </UInput>
          </UFormGroup>

          <UAlert
            v-if="error"
            color="red"
            variant="subtle"
            :description="error"
          />

          <UAlert
            v-if="successUrl"
            color="green"
            variant="subtle"
          >
            <template #description>
              <p class="mb-2 font-semibold">
                {{ `We've created your domain: ${successUrl}` }}
              </p>
              <div class="flex gap-2">
                <UButton
                  size="xs"
                  variant="solid"
                  color="white"
                  class="mr-auto"
                  @click="copyUrl()"
                >
                  Copy URL
                </UButton>
                <UButton
                  size="xs"
                  variant="solid"
                  color="white"
                  :to="successUrl"
                  target="_blank"
                >
                  Open URL
                </UButton>
                <UButton
                  size="xs"
                  variant="solid"
                  color="white"
                  :to="statsUrl"
                  target="_blank"
                >
                  View Stats
                </UButton>
              </div>
            </template>
          </UAlert>

          <!-- submit button -->
          <UButton
            block
            color="primary"
            type="submit"
            :loading="loading"
          >
            Create
          </UButton>
        </UForm>
      </UCard>
      <p class="text-sm text-center text-gray-500 mt-4">
        <!-- eslint-disable-next-line -->
              Made by <a href="https://x.com/timb03" target="_blank" class="underline">timb03</a>, <a href="https://github.com/timb-103/dm.new" target="_blank" class="underline">open source</a> and powered by <a href="https://dub.co" target="_blank" class="underline">dub</a>.
      </p>
    </div>

    <UNotifications />
  </div>
</template>

<script setup lang="ts">
import { object, string, type InferType } from 'yup';
import { useClipboard } from '@vueuse/core';
import type { FormSubmitEvent } from '#ui/types';

useSeoMeta({
  title: 'dm.new',
  description: 'A quick way for people to slide in your X dm\'s. 100% free 📩'
});

useHead({
  link: [
    { rel: 'icon', href: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📩</text></svg>' }
  ]
});

const UrlFormSchema = object({
  username: string()
    .required(),
  url: string()
    .min(3, 'Min 3 characters. Send Tim a dm to claim a shorter')
    .matches(/^[a-zA-Z0-9-]+$/, 'URL can only contain letters, numbers, or dashes')
    .required()
});

export type UrlForm = InferType<typeof UrlFormSchema>;

const successUrl = ref<string>();
const statsUrl = ref<string>();
const loading = ref(false);
const error = ref<string>();
const toast = useToast();

const state = ref<UrlForm>({
  username: '',
  url: ''
});

async function copyUrl(): Promise<void> {
  const { copy } = useClipboard({ source: successUrl.value });
  await copy();
  toast.add({ title: 'Copied!' });
}

async function onSubmit(event: FormSubmitEvent<UrlForm>): Promise<void> {
  loading.value = true;
  successUrl.value = undefined;
  statsUrl.value = undefined;
  error.value = undefined;

  useTrackEvent('create-link');

  try {
    await $fetch('/api/create', {
      method: 'POST',
      body: {
        url: event.data.url,
        username: event.data.username
      }
    });

    successUrl.value = `https://dm.new/${event.data.url}`;
    statsUrl.value = `https://dm.new/stats/${event.data.url}`;
  } catch (err: any) {
    error.value = err.response?._data?.message ?? err.message;
  }

  loading.value = false;
}

</script>
