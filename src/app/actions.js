'use server';

import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function loginAdmin(formData) {
  const password = formData.get('password');
  const adminPassword = process.env.ADMIN_PASSWORD || 'rahasia123'; // fallback if not set

  if (password === adminPassword) {
    (await cookies()).set('admin_token', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });
    return { success: true };
  } else {
    return { success: false, error: 'Password salah!' };
  }
}

export async function logoutAdmin() {
  (await cookies()).delete('admin_token');
  revalidatePath('/admin');
}

export async function addThesis(formData) {
  const token = (await cookies()).get('admin_token');
  if (!token || token.value !== 'authenticated') {
    return { success: false, error: 'Tidak ada akses.' };
  }

  const author = formData.get('author');
  const title = formData.get('title');
  const year = parseInt(formData.get('year'));
  const type = formData.get('type') || 'Skripsi';
  const university = formData.get('university') || 'Universitas Hasanuddin';

  if (!author || !title || !year) {
    return { success: false, error: 'Semua kolom wajib diisi!' };
  }

  try {
    await prisma.thesis.create({
      data: {
        author,
        title,
        year,
        type,
        university
      }
    });
    
    // Refresh the home page and admin page to show new data
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Insert error:', error);
    return { success: false, error: 'Gagal menambahkan data ke database.' };
  }
}

export async function addYoutubeVideo(formData) {
  const token = (await cookies()).get('admin_token');
  if (!token || token.value !== 'authenticated') {
    return { success: false, error: 'Tidak ada akses.' };
  }

  const id = formData.get('id');
  const title = formData.get('title');
  const channel = formData.get('channel') || 'Unknown Channel';
  const webpage_url = formData.get('webpage_url') || `https://www.youtube.com/watch?v=${id}`;
  const thumbnail = formData.get('thumbnail') || `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

  if (!id || !title) {
    return { success: false, error: 'ID Video dan Judul wajib diisi!' };
  }

  try {
    await prisma.youtubeVideo.create({
      data: {
        id,
        title,
        channel,
        webpage_url,
        thumbnail,
        view_count: 0,
        like_count: 0
      }
    });
    
    revalidatePath('/videos');
    return { success: true };
  } catch (error) {
    console.error('Insert error:', error);
    return { success: false, error: 'Gagal menambahkan video. Mungkin ID sudah ada di database.' };
  }
}

export async function updateYoutubeVideo(formData) {
  const token = (await cookies()).get('admin_token');
  if (!token || token.value !== 'authenticated') {
    return { success: false, error: 'Tidak ada akses.' };
  }

  const id = formData.get('id');
  const title = formData.get('title');
  const author = formData.get('author') || null;
  const nim = formData.get('nim') || null;
  const academic_year = formData.get('academic_year') ? parseInt(formData.get('academic_year')) : null;
  const thesis_type = formData.get('thesis_type') || null;

  if (!id || !title) {
    return { success: false, error: 'ID Video dan Judul wajib diisi!' };
  }

  try {
    await prisma.youtubeVideo.update({
      where: { id },
      data: {
        title,
        author,
        nim,
        academic_year,
        thesis_type
      }
    });
    
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Update error:', error);
    return { success: false, error: 'Gagal mengupdate data. Pastikan ID video benar.' };
  }
}
