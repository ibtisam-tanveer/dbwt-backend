import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  const allowedOrigins = [
    'http://localhost:3001', // Local development
    'http://localhost:3000', // Alternative local port
    process.env.FRONTEND_URL, // Production frontend URL
  ].filter(Boolean); // Remove undefined values

  app.enableCors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : true, // Allow all origins if none specified
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ 
    whitelist: true, 
    forbidNonWhitelisted: true,
    transform: true 
  }));
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
//    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
//"start": "nest start",