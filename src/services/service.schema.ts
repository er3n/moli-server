import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ServiceDocument = Service & Document;

@Schema()
export class Service {
  @Prop()
  category: string;

  @Prop()
  name: string;

  @Prop()
  duration?: number;

  @Prop()
  active: boolean;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);
