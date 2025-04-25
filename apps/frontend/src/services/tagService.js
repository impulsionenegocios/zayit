import api from '@/lib/axios';
export async function getTags() {
    return api.get('/tags/');
}
export async function getTagById(id) {
    return api.get(`/tags/${id}`);
}
export async function createTag(tag) {
    return api.post('/tags/', tag);
}
export async function updateTag(id, tag) {
    return api.put(`/tags/${id}`, tag);
}
export async function deleteTag(id) {
    return api.delete(`/tags/${id}`);
}
