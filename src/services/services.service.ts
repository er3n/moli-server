import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Service, ServiceDocument } from './service.schema';

@Injectable()
export class ServicesService {
  constructor(
    @InjectModel(Service.name) private serviceModel: Model<ServiceDocument>,
  ) {}

  async query(): Promise<Service[]> {
    const users = await this.serviceModel.find().sort({ name: 1 }).exec();
    return users;
  }

  async create(service: Service): Promise<Service> {
    const serviceWithSameName = await this.serviceModel
      .findOne({
        name: service.name,
      })
      .exec();
    if (serviceWithSameName) {
      throw new ConflictException(
        `${service.name} adında bir hizmet bulunmaktadır.`,
      );
    }

    const serviceModel = new this.serviceModel(service);
    return serviceModel.save();
  }

  async update(id: string, service: Service): Promise<Service> {
    const existService = await this.serviceModel.findById(id).exec();

    if (!existService) {
      throw new NotFoundException('Güncellenmek istenen servis bulunamadi.');
    }

    if (service.name && service.name !== existService.name) {
      const serviceWithSameName = await this.serviceModel
        .findOne({
          name: service.name,
        })
        .exec();
      if (serviceWithSameName) {
        throw new ConflictException(
          `${service.name} adında bir hizmet bulunmaktadır.`,
        );
      }
    }

    await this.serviceModel.updateOne(
      { _id: id },
      {
        $set: service,
      },
    );

    return await this.serviceModel.findById(id).exec();
  }

  async delete(id: string): Promise<Service> {
    const deletedService = await this.serviceModel.findOneAndDelete({
      _id: id,
    });
    if (!deletedService) {
      throw new NotFoundException('Hizmet bulunamadi');
    }
    return deletedService;
  }

  async queryCategories(): Promise<string[]> {
    const res = await this.serviceModel.aggregate([
      {
        $match: {
          active: true,
        },
      },
      {
        $sort: {
          category: 1,
        },
      },
      {
        $group: {
          _id: '$category',
        },
      },
    ]);
    return res.map((item) => item._id);
  }
}
