import { IsBoolean, IsNotEmptyObject, IsOptional } from 'class-validator';
import { ClientCreditCard } from '../client.interface';

export class UpdateClientDto {
  @IsNotEmptyObject()
  Client: Client;

  @IsBoolean()
  @IsOptional()
  SendEmail?: boolean;

  @IsBoolean()
  CrossRegionalUpdate: boolean;

  @IsBoolean()
  @IsOptional()
  Test?: boolean;
}

export interface Client {
  BirthDate?: string;
  Country?: string;
  EmailOptIn?: boolean;
  FirstName?: string;
  Id: string;
  ClientCreditCard?: ClientCreditCard;
  IsProspect?: boolean;
  LastName?: string;
  LiabilityRelease?: boolean;
  MobileProvider?: number;
  Notes?: string;
  PromotionalEmailOptIn?: boolean;
  State?: string;
  RedAlert?: string;
  YellowAlert?: string;
  MiddleName?: string;
  Email?: string;
  MobilePhone?: string;
  HomePhone?: string;
  WorkPhone?: string;
  AddressLine1?: string;
  AddressLine2?: string;
  City?: string;
  PostalCode?: string;
  WorkExtension?: string;
  ReferredBy?: string;
  PhotoUrl?: string;
  EmergencyContactInfoName?: string;
  EmergencyContactInfoEmail?: string;
  EmergencyContactInfoPhone?: string;
  EmergencyContactInfoRelationship?: string;
  Gender?: string;
  SendAccountEmails: boolean;
  SendAccountTexts: boolean;
  SendPromotionalEmails: boolean;
  SendPromotionalTexts: boolean;
  SendScheduleEmails: boolean;
  SendScheduleTexts: boolean;
}
