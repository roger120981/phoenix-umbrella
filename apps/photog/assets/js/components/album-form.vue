<template>
    <div>
        <Form-Section
            :heading="headingText"
            :backLink="backLink"
            :save="save"
            :isSaving="isSaving"
            v-if="isInitialLoadComplete"
        >
            <template v-slot:inputs>
                <Form-Input
                    :id="idForField('name')"
                    label="Name"
                    :focus="true"
                    v-model="album.name"
                    :errors="errors.name"
                />

                <Form-Input
                    :id="idForField('is_favorite')"
                    label="Is Favorite"
                    v-model="album.is_favorite"
                    :errors="errors.is_favorite"
                    input-type="checkbox"
                />

                <Form-Input
                    :id="idForField('year')"
                    label="Year"
                    v-model="album.year"
                    :errors="errors.year"
                    input-type="number"
                />

                <Form-Input
                    :id="idForField('cover_image_id')"
                    label="Cover image id"
                    v-model="album.cover_image_id"
                    :errors="
                        (errors.cover_image_id || []).concat(
                            errors.cover_image || []
                        )
                    "
                    input-type="number"
                    v-if="isCreateForm"
                />

                <Form-Input
                    :id="idForField('description')"
                    label="Description"
                    v-model="album.description"
                    :errors="errors.description"
                    input-type="textarea"
                    :textarea-rows="4"
                />
            </template>
        </Form-Section>
        <div
            class="container"
            :class="$style.albumFormTagsContainer"
            v-if="this.tags.length > 0"
        >
            <h2>Tags</h2>
            <div class="form-group">
                <ul class="spread-content">
                    <li v-for="tag in tags" :key="tag.id">
                        <input
                            type="checkbox"
                            :id="idForTag(tag)"
                            :checked="tagsActive[tag.id]"
                            @change="tagChecked(tag.id)"
                        />
                        <label :for="idForTag(tag)">{{ tag.name }}</label>
                    </li>
                </ul>
                <div
                    class="pull-right"
                    :class="$style.btnContainer"
                    v-if="isEditForm"
                >
                    <spinner-button
                        :isLoading="isSaving"
                        :buttonClasses="['btn-success']"
                        buttonType="submit"
                        buttonText="Update tags"
                        spinnerText="Saving..."
                        @buttonClick="updateTags()"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" module>
.albumFormTagsContainer {
    padding-bottom: 4rem;
}
.btnContainer {
    margin-top: 3rem;
}
</style>

<script>
import { formMixinBuilder } from './mixins/form-mixin.js';
import { albumAndPersonFormMixinBuilder } from './mixins/album-and-person-form-mixin.js';
import { toApiResource } from '../form-helpers.js';
import { API_URL_BASE } from '../request-helpers.js';
import { getCurrentYear } from '../date-helpers';

import SpinnerButton from './form/spinner-button.vue';

export default {
    props: {
        modelId: {
            type: Number,
        },
        getModel: {
            type: Function,
            required: true,
        },
    },
    components: {
        SpinnerButton,
    },
    mixins: [formMixinBuilder(), albumAndPersonFormMixinBuilder()],
    beforeRouteEnter(to, from, next) {
        //unfortunately has to be duplicated here
        //since beforeRouteEnter can't be added via mixin
        next(self => {
            self.previousRoute = from;
        });
    },
    data() {
        return {
            //album is for our edits, model is the immutable album response from the api
            album: {},
            tags: [],
            tagsActive: {},
            resourceApiUrlBase: `/albums`,
            routeBase: 'albums',
        };
    },
    computed: {
        headingText() {
            if (this.isEditForm) {
                return `Edit ${this.model.name}`;
            }
            return 'New Album';
        },
        backLink() {
            if (this.isEditForm) {
                return { name: 'albumsShow', params: { id: this.modelId } };
            }
            return { name: 'albumsIndex' };
        },
    },
    methods: {
        idForTag(tag) {
            return `album_tag_${tag.id}_checkbox_id`;
        },
        tagChecked(tagId) {
            this.tagsActive[tagId] = !this.tagsActive[tagId];
        },
        getTagIdsForSave() {
            return this.tags.reduce((tagIds, tag) => {
                if (this.tagsActive[tag.id]) {
                    tagIds.push(tag.id);
                }
                return tagIds;
            }, []);
        },
        updateTags() {
            this.isSaving = true;
            const tag_ids = this.getTagIdsForSave();
            this.sendJson(
                `${API_URL_BASE}/albums/${this.album.id}/tags`,
                'PUT',
                { tag_ids }
            ).then(res => {
                this.isSaving = false;
                if (!res.error) {
                    this.saveSuccessful(this.album);
                }
            });
        },
        setupModel(album = null) {
            this.getModel('/tags').then(tags => {
                this.tags = tags;
            });

            //edit form
            if (album) {
                this.album = {
                    id: album.id,
                    name: album.name,
                    year: album.year,
                    description: album.description,
                    is_favorite: album.is_favorite,
                    cover_image_id: album.cover_image.id,
                };

                this.tagsActive = album.tags.reduce((tagsActive, tag) => {
                    tagsActive[tag.id] = true;
                    return tagsActive;
                }, {});
            }
            //new form
            else {
                const album = {
                    year: getCurrentYear(),
                    is_favorite: false,
                    cover_image_id: 0,
                };
                if (this.hasImages) {
                    album.cover_image_id = this.imagesInModel[0].id;
                }
                this.album = album;
            }
        },
        idForField(fieldName) {
            return `id_album_${fieldName}_input`;
        },
        getResourceForSave() {
            const data = { album: toApiResource(this.album) };
            if (this.isCreateForm) {
                if (this.hasImages) {
                    data.image_ids = this.imagesInModel.map(image => image.id);
                }
                const tag_ids = this.getTagIdsForSave();
                if (tag_ids.length > 0) {
                    data.tag_ids = tag_ids;
                }
            }
            return data;
        },
        saveSuccessful(album) {
            const modelId = album.id;
            const redirectPath =
                this.successRedirect === '1'
                    ? this.previousRoute
                    : { name: 'albumsShow', params: { id: modelId } };
            redirectPath.state = {
                flashMessage: JSON.stringify([
                    `${album.name} ${this.isEditForm ? 'updated' : 'created'}`,
                    'info',
                ]),
            };
            this.$router.push(redirectPath);
        },
    },
};
</script>
