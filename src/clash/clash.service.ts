import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateClashDto } from './dto/create-clash.dto';
import { UpdateClashDto } from './dto/update-clash.dto';
import { Clash } from './entities/clash.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClashItem } from './entities/clash_item.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ClashService {
  constructor(
    @InjectRepository(Clash) private readonly clashRepo: Repository<Clash>,
    @InjectRepository(ClashItem) private readonly clashItemRepo: Repository<ClashItem>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) { }



  async getAllClashes(userId: number): Promise<Clash[]> {
    const clashes = await this.clashRepo.find({
      where: {
        user: { id: userId },
      },
      relations: ['user'],
    });
    if (!clashes) {
      throw new NotFoundException();
    }
    console.log("clashes", clashes);
    return clashes;
  }

  async clashById(id: number): Promise<Clash> {
    // const clash = this.clashRepo.findOneBy({ id })
    const clash = await this.clashRepo.findOne({
      where: { id },
      relations: {
        ClashItem: true,
        ClashComments: true,
      },
      select: {
        id: true,
        title: true,
        description: true,
        image: true,
        ClashItem: {
          id: true,
          image: true,
          count: true,
        },
        ClashComments: {
          id: true,
          comment: true,
          created_at: true,
        },
      },
      order: {
        ClashComments: {
          id: 'DESC',
        },
      },
    });
    if (!clash) {
      throw new NotFoundException(`Clash not found`);
    }
    return clash;
  }

  // TODO: update directly instead of fetching.
  async updateClash(id: number, updatedImage?: string, updateClashDto?: UpdateClashDto) {
    const clash = await this.clashRepo.findOneBy({ id });

    if (!clash) {
      return new NotFoundException(`Clash not found`);
    }

    if (updatedImage) {
      updateClashDto.image = updatedImage;
      // TODO: delete img from uploads folder also
    }

    const updatedClash: Clash = {
      ...clash, // Keep the existing values
      ...updateClashDto, // Overwrite with new values from DTO
    };

    // Save the updated entity back to the database
    return await this.clashRepo.save(updatedClash);
  }

  // TODO: fetch userid form auth and add user id here
  async createClash(userId: number, createClashDto: CreateClashDto): Promise<Clash> {
    const user = await this.userRepo.findOneBy({ id: userId });
    console.log("user", user);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    const newClash = this.clashRepo.create({
      ...createClashDto,
    })
    console.log("newClash", newClash);
    newClash.user = user;
    console.log("newClash.user", newClash);
    return this.clashRepo.save(newClash);

  }

  async deleteClash(id: number) {
    const result = await this.clashRepo.delete(id); // Directly deletes the entity by ID
    if (result.affected === 0) {
      throw new NotFoundException('Clash not found');
    }
  }

  async createClashItems(uploadedImages: string[], clashId: number) {

    if (uploadedImages.length < 2) {
      throw new BadRequestException("Please add both images ");
    }


    const clash = await this.clashRepo.findOne({ where: { id: clashId } });

    if (!clash) {
      throw new NotFoundException(`Clash not found.`);
    }

    const clashItems = uploadedImages.map((image) => {
      return this.clashItemRepo.create({
        clash: clash,
        image: image,
      });
    });

    console.log("Clash item to be created -", clashItems);
    // clash.ClashItem = clashItems;

    // await this.clashRepo.save(clash);
    await this.clashItemRepo.save(clashItems);
  }

}
