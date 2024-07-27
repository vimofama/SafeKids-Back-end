import { Module } from '@nestjs/common';
import * as admin from 'firebase-admin';

const serviceAccount: admin.ServiceAccount = {
  projectId: 'safekids-70b8b',
  privateKey:
    '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDcTJxHkGuHR9DM\nVECAtZZd7Wx905y8oF0RplQ0FzNWpvI7vTbh+KBiYIj0gKf1Qz/d3GxjzQlqcS9k\nOJprh8zl40Ofu1snqZE91ynJgJFqVLFQWLQbT8eS6FQiz8kfLO5PlsPhW9b3fz3M\n9DNxKRQz74AUVXh4NEn9DTjRyPqYAKdMut59c7XtcAX0ByTb9bSbfJRFQI5TZIrE\nEG5dCQBzgwwv3IP9Adi+obNL82tA79tap/Wpml2iCzjximcNw/Ah5aSItd4yZDVC\nWYG8a20FJRFZthgimB1II6gF7qHwn53AuhaPTDhqkC1Lx60eqtRw2rz4vpjDwgC8\nW801banFAgMBAAECggEANPCAGb596Jt8dK3Gdmesw9ObX71ri/SpiOVElOQCZU9n\nJK36s2DxAdMa9k64jfrkLSecMHuESLz8W4Qyr6aJubDcflUiuaxJB+hd1Vt9FmVV\n2u4GEg4g8o+8MEVomoJMnnmnhs9wIDfGnSsN9aKehUCHsds8QP6nzRTRU7CNb9s+\nLZsFBcw/rYYliMH+Kfj6zIqd9juUcT4B3QOCObqRduPE44IR2mja12vQXTkoQQHp\nO8MN/kfCJ2z5cjuAFmI8Tmg0bHr1PmgnCrNhDWilamUOwR03DspaJeweU7MnCQXk\n84AxHV4NsfCJOeKLlH/1auwgMX1nJvTulrQJGjVT4QKBgQDzILcbDPc8ojHIwXdL\nYIeIJOGS/4pkRzYXO2xXMWqL2Tz3VldO/fEz1egzRco68ccfvnzmIGBAHj6kpSgB\nqnKln6+E7jZwYCOz4KzXxt/bqIfjKD9NJPXFIQFxHZixv540YZNIpIYF8rY+8xuh\navk9Bmi2ArFKaEyP6NbQW3jx/QKBgQDn9nvYXNAyEXWeb7y28NqpzBFI0CFfCrHn\nXdXkVk7V2U6NzHO19Kqj1O5+sMf53ljDMK96V5rCrczK7ZYIcZm2TSWUH90kv8ek\nZa6/oWoJXyyxg7sonpWiSZcE1DAd/sMwGVFZllOlqt86O+/aoJoBvd+d1H3xW0dR\nAUA7cgfdaQKBgEcAX9jrgWxYpZdOQItnxkzREHtAW2cLkNVaCjqweMAckfxdX6P2\n7zDHIEeQ8w0hvJgdphYCkHlJG9wzSyqpX0/VAYodkxJgUSzfyTo+nvNkFUMWZt4d\nlBScnfItxYDrR8VeVYfaXDVyexyJHKGYPu8+Zuf4g1QKf4lrYwh4Hir1AoGARNaQ\nMEhy/LjTt/4e+geGTOejpYEmtibdXvUo+cdnQ+1mc4xeNnxye4ZAdNaPsiZ7Hwn+\nuYbwBaBAa2SQptbXsBM6+LdwEGzdmXsXngUQC9Hz2IZob4iIjY3bRHKYCP7G/Co3\nSyfikQKhlo2dA7uvmJ65kwQxkAPvqSl+32Va0ikCgYEArf0Yf20wqDwlfk9CcNgr\nzCwriADAyEfYoZfyMM5Wn6R/nkfQfY4UV4IWyHKBDxpgtsS7zOhVN1qhGZ3nRLm8\nEjG765zx3be/SGP3sUNgc3FxELCqt0SUHd3vZDoXUjHAG1z+rnIViETdvpILI6bZ\nPrVz3J92fFCBuBXRfLKjoys=\n-----END PRIVATE KEY-----\n',
  clientEmail: 'firebase-adminsdk-wvngv@safekids-70b8b.iam.gserviceaccount.com',
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://safekids-70b8b.appspot.com',
});

/**
 * Firebase Admin Module
 */
@Module({})
export class FirebaseAdminModule {
  public static admin = admin;
}
