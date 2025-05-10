import {
	Body,
	Head,
	Heading,
	Html,
	Link,
	Preview,
	Section,
	Tailwind,
	Text,
  } from '@react-email/components';
  import * as React from 'react';
  
  interface AccountDeletionTemplateProps {
	domain: string;
  }
  
  export function AccountDeletionTemplate({ domain }: AccountDeletionTemplateProps) {
	const registerLink = `${domain}/account/create`;
  
	return (
	  <Html>
		<Head />
		<Preview>Спасибо, что были с нами на BeaverStream</Preview>
		<Tailwind>
		  <Body className="max-w-2xl mx-auto p-6 bg-slate-50">
			<Section className="text-center">
			  <Heading className="text-2xl text-black font-bold">
				До скорой встречи на BeaverStream
			  </Heading>
			  <Text className="text-base text-black mt-2">
				Здравствуйте! Мы хотим сообщить, что ваш аккаунт был деактивирован в соответствии с вашей просьбой или политикой использования платформы.
			  </Text>
			</Section>
  
			<Section className="bg-white text-black text-center rounded-lg shadow-md p-6 mb-4">
			  <Text>
				Все ваши личные данные были удалены из нашей системы. Мы благодарим вас за время, проведённое вместе с нами!
			  </Text>
			  <Text className="mt-2">
				Если вы захотите вернуться, вы всегда можете зарегистрировать новый аккаунт:
			  </Text>
			  <Link
				href={registerLink}
				className="inline-flex justify-center items-center rounded-md mt-2 text-sm font-medium text-white bg-[#18B9AE] px-5 py-2"
			  >
				Создать новый аккаунт
			  </Link>
			</Section>
  
			<Section className="text-center text-black text-sm mt-4">
			  <Text>
				Это автоматическое уведомление от BeaverStream ({domain}). Если вы получили это письмо по ошибке или у вас есть вопросы, пожалуйста, свяжитесь с нашей поддержкой.
			  </Text>
			  <Text className="mt-2">
				Благодарим вас за выбор нашей платформы!
			  </Text>
			</Section>
		  </Body>
		</Tailwind>
	  </Html>
	);
}  