import { ConfigService } from '@nestjs/config'
import {
	Args,
	Mutation,
	Parent,
	Query,
	ResolveField,
	Resolver
} from '@nestjs/graphql'
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js'
import * as Upload from 'graphql-upload/Upload.js'
import { RoomServiceClient } from 'livekit-server-sdk'

import type { User } from '@/prisma/generated'
import type { Stream } from '@/prisma/generated'
import { Authorization } from '@/src/shared/decorators/auth.decorator'
import { Authorized } from '@/src/shared/decorators/authorized.decorator'
import { FileValidationPipe } from '@/src/shared/pipes/file-validation.pipe'

import { ChangeStreamInfoInput } from './inputs/change-stream-info.input'
import { FiltersInput } from './inputs/filters.input'
import { GenerateStreamTokenInput } from './inputs/generate-stream-token.input'
import { GenerateStreamTokenModel } from './models/generate-stream-token.model'
import { StreamModel } from './models/stream.model'
import { StreamService } from './stream.service'

@Resolver(() => StreamModel)
export class StreamResolver {
	public constructor(
		private readonly streamService: StreamService,
		private readonly configService: ConfigService
	) {}

	@Query(() => [StreamModel], { name: 'findAllStreams' })
	public async findAll(@Args('filters') input: FiltersInput) {
		return this.streamService.findAll(input)
	}

	@Query(() => [StreamModel], { name: 'findRandomStreams' })
	public async findRandom() {
		return this.streamService.findRandom()
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'changeStreamInfo' })
	public async changeInfo(
		@Authorized() user: User,
		@Args('data') input: ChangeStreamInfoInput
	) {
		return this.streamService.changeInfo(user, input)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'changeStreamThumbnail' })
	public async changeThumbnail(
		@Authorized() user: User,
		@Args('thumbnail', { type: () => GraphQLUpload }, FileValidationPipe)
		thumbnail: Upload
	) {
		return this.streamService.changeThumbnail(user, thumbnail)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'removeStreamThumbnail' })
	public async removeThumbnail(@Authorized() user: User) {
		return this.streamService.removeThumbnail(user)
	}

	@Mutation(() => GenerateStreamTokenModel, { name: 'generateStreamToken' })
	public async generateToken(@Args('data') input: GenerateStreamTokenInput) {
		return this.streamService.generateToken(input)
	}

	@ResolveField(() => Number)
	async viewerCount(@Parent() stream: StreamModel): Promise<number> {
		const livekitHost = this.configService.get<string>('LIVEKIT_API_URL')
		const apiKey = this.configService.get('LIVEKIT_API_KEY')
		const apiSecret = this.configService.get('LIVEKIT_API_SECRET')

		const roomName = stream.userId

		const client = new RoomServiceClient(livekitHost, apiKey, apiSecret)

		try {
			const rooms = await client.listRooms()
			const room = rooms.find(r => r.name === roomName)

			return room ? Math.max(0, room.numParticipants - 1) : 0
		} catch (e) {
			return 0
		}
	}
}
