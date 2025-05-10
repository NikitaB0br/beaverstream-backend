import { IngressClient } from 'livekit-server-sdk'

const API_KEY = 'APIRZUCr4BxX4cJ'
const API_SECRET = 'fwhah2cFI7Zavwl82qPbovGlyZ0Znb3dlxKmumhcGXX'
const BASE_URL = 'https://beaverstream-wmbsm57d.livekit.cloud'

async function deleteAllIngress() {
	const client = new IngressClient(BASE_URL, API_KEY, API_SECRET)

	try {
		const ingressList = await client.listIngress()

		if (!ingressList.length) {
			console.log('⚠️ Нет Ingress-запросов для удаления.')
			return
		}

		for (const ingress of ingressList) {
			await client.deleteIngress(ingress.ingressId)
			console.log(
				`🗑️ Удалён Ingress: ${ingress.name} (${ingress.ingressId})`
			)
		}

		console.log('✅ Все Ingress-запросы удалены.')
	} catch (error) {
		console.error('❌ Ошибка при удалении:', error)
	}
}

deleteAllIngress()
