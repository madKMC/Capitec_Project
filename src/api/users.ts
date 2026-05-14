import { apiFetch } from './client';

export function getUsers() {
    return apiFetch('/users');
}

export function getUserById(id: string) {
    return apiFetch(`/users/${id}`);
}

export function createUser(userData: Record<string, unknown>) {
    return apiFetch('/users', {
        method: 'POST',
        body: JSON.stringify(userData),
    });
}