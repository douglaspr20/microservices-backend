import { Level, Program, SessionType } from './class.interface';

export interface IClassDescription {
  Active: boolean;
  Description: string;
  Id: number;
  ImageURL: null;
  LastUpdated: string;
  Level: Level;
  Name: string;
  Notes: string;
  Prereq: string;
  Program: Program;
  SessionType: SessionType;
  Category: null;
  CategoryId: null;
  Subcategory: null;
  SubcategoryId: null;
}
