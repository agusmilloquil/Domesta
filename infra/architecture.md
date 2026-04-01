# Arquitectura y escalabilidad recomendada

## Fase 1: MVP (Mar del Plata)
- Web React en Vercel.
- API Node/Express en un servicio contenedorizado.
- PostgreSQL administrado (RDS/Supabase).
- Redis para sesiones, rate limit y colas simples.
- Storage S3 para documentos de verificación.

## Fase 2: Escala nacional
- Separar servicios: auth, matching, jobs, chat, compliance.
- Búsqueda geográfica optimizada (PostGIS/Elastic).
- Eventos con cola (SQS/Kafka) para notificaciones y auditoría.
- Observabilidad completa (OpenTelemetry + dashboards).

## Seguridad y cumplimiento
- JWT corto + refresh tokens rotativos.
- Cifrado en tránsito y en reposo.
- RBAC estricto para admin/moderación.
- Registro de auditoría para acciones sensibles.
- Términos y políticas adaptadas a normativa argentina (incluyendo protección de datos y empleo doméstico registrado).
