import { Sequelize } from "sequelize";
import { RedisClientType as GenericRedisClientType } from "@redis/client/dist/lib/client";
import { RedisDefaultModules } from "redis";
import { PrismaClient } from "./generated/prisma/index";
type Gender = "male" | "female";

export interface UserDatabaseModel {
  id: bigint | number;
  first_name: string | null;
  last_name: string | null;
  gender: Gender | null;
  pinfl: string | null;
  birth: bigint | null;
  nationality: string | null;
  passport_series: string | null;
  passport_number: number | null;
  passport_exp: bigint | null;
  photo: string | null;
  my_id_photo: string | null;
  phone_number: string;
  rating: number;
  user_verification: boolean;
  driver_verification: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface UserTokenPayload {
  id: number;
  first_name: string | null;
  last_name: string | null;
  phone: string;
  gender: string | null;
  photo: string | null;
  rating: number;
  device: string;
  user_verified: boolean;
  driver_verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RequestDevice {
  id: string;
  brand: string;
  model: string;
  OS: string;
  version: string;
  app_version: string;
  language: Language;
  user_id: bigint | null;
  fcm_token?: string | null;
  access_token?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ResendOtpTokenPayload {
  user_id: number;
  phone_number: string;
  sms_token: string;
  expTime: number;
  start_time: number;
}

export {};
declare global {
  var db: Sequelize;
  var redis: GenericRedisClientType<
    RedisDefaultModules & M,
    F,
    S,
    RESP,
    TYPE_MAPPING
  >;
  var database: PrismaClient;
  namespace Express {
    interface Request {
      device?: RequestDevice;
      user?: UserDatabaseModel;
    }
  }
}

export interface MyIDCredentials {
  data: {
    comparison_value: number;
    pass_data: string;
    job_id: string;
    profile: {
      common_data: {
        first_name: string;
        middle_name?: string | null;
        last_name: string;
        first_name_en?: string | null;
        last_name_en?: string | null;
        pinfl: string;
        gender: string;
        birth_place: string;
        birth_country: string;
        birth_country_id: string;
        birth_country_id_cbu: string;
        birth_date: string;
        nationality: string;
        nationality_id: string;
        nationality_id_cbu: string;
        citizenship: string;
        citizenship_id: string;
        citizenship_id_cbu: string;
        sdk_hash: string;
        last_update_pass_data: string;
        last_update_address: string;
      };
      doc_data: {
        pass_data: string;
        issued_by: string;
        issued_by_id: string;
        issued_date: string;
        expiry_date: string;
        doc_type: string;
        doc_type_id: string;
        doc_type_id_cbu: string;
      };
      contacts?: {
        phone?: string | null;
        email?: string | null;
      } | null;
      address?: {
        permanent_address: string;
        temporary_address?: string | null;
        permanent_registration: {
          region: string;
          address?: string | null;
          country: string;
          cadastre?: string | null;
          district?: string | null;
          region_id: string;
          country_id: string;
          district_id: string;
          region_id_cbu: string;
          country_id_cbu: string;
          district_id_cbu: string;
          registration_date: string;
        };
        temporary_registration?: {
          region: string;
          address?: string | null;
          cadastre: string;
          district?: string | null;
          date_from?: string | null;
          date_till: string;
          region_id: string;
          district_id: string;
          region_id_cbu: string;
          district_id_cbu: string;
        } | null;
      } | null;
    };
  };
  reuid: {
    expires_at: number;
    value: string;
  };
}
