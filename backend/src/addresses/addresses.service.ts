import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, IsNull } from 'typeorm';
import { Address } from './entities/address.entity';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    private readonly dataSource: DataSource,
  ) {}

  async create(user: User, dto: CreateAddressDto): Promise<Address> {
    const address = this.addressRepository.create({
      user,
      addressLine: dto.addressLine,
      city: dto.city,
      state: dto.state,
      postalCode: dto.postalCode,
      country: dto.country,
    } as Partial<Address>);

    // If user has no addresses, make this default
    const count = await this.addressRepository.count({ where: { user } });
    if (count === 0) {
      address.isDefault = true;
    }

    return this.addressRepository.save(address);
  }

  async findAll(user: User): Promise<Address[]> {
    return this.addressRepository.find({ where: { user, deletedAt: IsNull() } });
  }

  async findOne(user: User, id: number): Promise<Address> {
    const address = await this.addressRepository.findOne({
      where: { id, user, deletedAt: IsNull() },
    });
    if (!address) throw new NotFoundException('Address not found');
    return address;
  }

  async update(user: User, id: number, dto: UpdateAddressDto): Promise<Address> {
    const address = await this.findOne(user, id);
    Object.assign(address, dto);
    return this.addressRepository.save(address);
  }

  async remove(user: User, id: number): Promise<void> {
    const address = await this.findOne(user, id);
    // business rule: allow delete unless it's the only address
    const count = await this.addressRepository.count({ where: { user, deletedAt: IsNull() } });
    if (count <= 1) {
      throw new ForbiddenException('Cannot delete the only address');
    }
    await this.addressRepository.remove(address);
  }

  async softDelete(user: User, id: number): Promise<void> {
    const address = await this.findOne(user, id);
    address.deletedAt = new Date();
    // if it was default, try set another as default
    if (address.isDefault) {
      const other = await this.addressRepository.findOne({ where: { user, deletedAt: IsNull(), isDefault: false } });
      if (other) {
        other.isDefault = true;
        await this.addressRepository.save(other);
      }
    }
    await this.addressRepository.save(address);
  }

  async makeDefault(user: User, id: number): Promise<Address> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const address = await this.addressRepository.findOne({ where: { id, user, deletedAt: IsNull() } });
      if (!address) throw new NotFoundException('Address not found');

      await queryRunner.manager.update(Address, { user, isDefault: true }, { isDefault: false });

      address.isDefault = true;
      const saved = await queryRunner.manager.save(address);
      await queryRunner.commitTransaction();
      return saved;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
