import { Injectable, NotFoundException } from '@nestjs/common'

import { PrismaService } from '@/src/core/prisma/prisma.service'

@Injectable()
export class ChannelService {
	public constructor(private readonly prismaService: PrismaService) {}

	public async findRecommended() {
		const activeChannels = await this.prismaService.user.findMany({
			where: {
				isDeactivated: false,
				stream: {
					is: {
						isLive: true
					}
				}
			},
			include: {
				stream: true
			},
			take: 7
		})

		const activeCount = activeChannels.length

		if (activeCount >= 7) {
			return activeChannels
		}

		const remaining = 7 - activeCount

		const totalInactive = await this.prismaService.user.count({
			where: {
				isDeactivated: false,
				OR: [{ stream: null }, { stream: { isLive: false } }]
			}
		})

		const randomSkip = Math.floor(
			Math.random() * Math.max(totalInactive - remaining, 1)
		)

		const inactiveChannels = await this.prismaService.user.findMany({
			where: {
				isDeactivated: false,
				OR: [{ stream: null }, { stream: { isLive: false } }]
			},
			include: {
				stream: true
			},
			skip: randomSkip,
			take: remaining
		})

		return [...activeChannels, ...inactiveChannels]
	}

	public async findByUsername(username: string) {
		const channel = await this.prismaService.user.findUnique({
			where: {
				username,
				isDeactivated: false
			},
			include: {
				socialLinks: {
					orderBy: {
						position: 'asc'
					}
				},
				stream: {
					include: {
						category: true
					}
				},
				followings: true,
				sponsorshipPlans: true,
				sponsorshipSubscriptions: true
			}
		})

		if (!channel) {
			throw new NotFoundException('Канал не найден')
		}

		return channel
	}

	public async findFollowersCountByChannel(channelId: string) {
		const count = await this.prismaService.follow.count({
			where: {
				following: {
					id: channelId
				}
			}
		})

		return count
	}

	public async findSponsorsByChannel(channelId: string) {
		const channel = await this.prismaService.user.findUnique({
			where: {
				id: channelId
			}
		})

		if (!channel) {
			throw new NotFoundException('Канал не найден')
		}

		const sponsors =
			await this.prismaService.sponsorshipSubscription.findMany({
				where: {
					channelId: channel.id
				},
				orderBy: {
					createdAt: 'desc'
				},
				include: {
					plan: true,
					user: true,
					channel: true
				}
			})

		return sponsors
	}
}
