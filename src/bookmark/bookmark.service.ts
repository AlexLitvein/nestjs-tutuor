/* eslint-disable prettier/prettier */
import { PrismaService } from '@App/prisma/prisma.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {constructor(private prisma: PrismaService) { }
async getBookmarks      (userId: string                                          ) {const bookmarks = await this.prisma.bookmark.findMany  ({where: {userId                },});return bookmarks;}
async createBookmark    (userId: string, dto: CreateBookmarkDto                  ) {const bookmark  = await this.prisma.bookmark.create    ({data:  {userId,...dto,        },});return bookmark;}
async getBookmarkById   (userId: string, bookmarkId: string                      ) {const bookmark  = await this.prisma.bookmark.findFirst ({where: {id: bookmarkId,userId,},});return bookmark;}
async editBookmarkById  (userId: string, bookmarkId: string,dto: EditBookmarkDto,) {const bookmark  = await this.prisma.bookmark.findUnique({where: {id: bookmarkId,       },}); if (!bookmark || bookmark.userId !== userId) {throw new ForbiddenException('Эта закладка вам не принадлежит');} return this.prisma.bookmark.update({where: {id: bookmarkId,},data: {...dto,},});}
async deleteBookmarkById(userId: string, bookmarkId: string                      ) {const bookmark  = await this.prisma.bookmark.findUnique({where: {id: bookmarkId,       },}); if (!bookmark || bookmark.userId !== userId) {throw new ForbiddenException('Эта закладка вам не принадлежит');  await  this.prisma.bookmark.delete({where: {id: bookmarkId,},});}}
}