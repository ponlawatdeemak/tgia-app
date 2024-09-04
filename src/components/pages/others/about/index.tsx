'use client'

import { Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { ResponseLanguage } from '@/api/interface'

const AboutMain = () => {
	const { t, i18n } = useTranslation(['appbar'])
	const language = i18n.language as keyof ResponseLanguage

	const link = 'https://www.youtube.com/embed/l5BuR7T04w4?si=CAeYHE-SQhTYEHbn'

	return (
		<div className='box-border flex h-full flex-col p-4'>
			<div className='box-border flex h-full flex-col space-y-4 rounded-lg bg-white p-6'>
				<Typography className='mb-2 text-base font-semibold'>{t('menu.about')}</Typography>
				{language === 'th' ? (
					<div className='space-y-4 overflow-scroll px-6'>
						<div className='flex justify-center py-4'>
							<iframe
								width='560'
								height='315'
								className='rounded-xl'
								src={link}
								title='YouTube video player'
								allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
								referrerPolicy='strict-origin-when-cross-origin'
								allowFullScreen
							></iframe>
						</div>
						<Typography className='text-base font-semibold'>
							กรมส่งเสริมการเกษตร จับมือกับสมาคมประกันวินาศภัยไทยและไทยคม
							เพื่อยกระดับมาตรฐานการประกันภัยพืชผลสำหรับเกษตรกรไทย โดยใช้ข้อมูลดาวเทียมและเทคโนโลยีอวกาศ
						</Typography>
						<Typography className='indent-8 text-sm font-normal'>
							กรมส่งเสริมการเกษตรร่วมกับสององค์กร
							ลงนามในข้อตกลงความร่วมมือโครงการช่วยเหลือเกษตรกรผู้ประสบภัย
							โดยนำข้อมูลดาวเทียมมาใช้ในระบบประกันภัยพืชผล
							เพื่อพัฒนาแนวทางการประยุกต์ใช้วิทยาศาสตร์และเทคโนโลยีในประกันภัยพืชผลสำหรับเกษตรกรไทย
							พร้อมทั้งยกระดับมาตรฐานการประกันภัยด้านการเกษตรให้มีประสิทธิภาพมากยิ่งขึ้นด้วยเทคโนโลยีอวกาศ
						</Typography>
						<Typography className='indent-8 text-sm font-normal'>
							ภายใต้ความร่วมมือนี้ กรมส่งเสริมการเกษตร สมาคมประกันวินาศภัยไทย และไทยคม
							จะร่วมกันพัฒนาการใช้วิทยาศาสตร์และเทคโนโลยีในประกันภัยพืชผล
							โดยใช้เทคโนโลยีดาวเทียมสำรวจทรัพยากรโลก (Earth Observation Satellite) ระบบวิเคราะห์ข้อมูล
							(Data Analytics System) และเทคโนโลยีปัญญาประดิษฐ์ (Artificial Intelligence/Machine Learning)
							ในการวิเคราะห์ข้อมูลขนาดใหญ่ เช่น ข้อมูลแปลงเกษตร พันธุ์ข้าว พื้นที่ประสบภัยพิบัติ และอื่น ๆ
							เป้าหมายหลักคือการวางแผนและช่วยเหลือเกษตรกรผู้ประสบภัยพิบัติให้ได้รับเงินสินไหมทดแทนอย่างรวดเร็วและถูกต้อง
							ลดต้นทุนของเกษตรกร และยังช่วยให้ภาครัฐมีข้อมูลที่แม่นยำ
							เพื่อนำไปใช้ในการวางแผนรับมือกับภัยพิบัติได้ทันเวลา และลดความเสี่ยงในอนาคต
							รวมทั้งบริหารจัดการงบประมาณได้อย่างมีประสิทธิภาพ นอกจากนี้
							ยังมีเป้าหมายในการบูรณาการความร่วมมือด้านข้อมูล เช่น ข้อมูลสารสนเทศ ข้อมูลภูมิสารสนเทศ
							และงานวิจัย เพื่อพัฒนาศักยภาพบุคลากรทั้งสามหน่วยงานให้มีความรู้ความสามารถ
							เพื่อขับเคลื่อนภาคอุตสาหกรรมเกษตรของประเทศให้ก้าวหน้าในอนาคต
						</Typography>
						<Typography className='indent-8 text-sm font-normal'>
							สำหรับปี 2567 กรมส่งเสริมการเกษตรได้กำหนดแนวทางในการขับเคลื่อนภารกิจ
							โดยเน้นการส่งเสริมการเกษตรเชิงพื้นที่ สร้างสินค้าเกษตรมูลค่าสูง (High Value)
							ควบคู่กับการใช้ทรัพยากรอย่างคุ้มค่า ส่งเสริมการทำเกษตรที่เป็นมิตรกับสิ่งแวดล้อม (Low Carbon)
							เพิ่มพื้นที่สีเขียวในภาคการเกษตร ปรับเปลี่ยนวิธีการทำงานสู่การใช้เทคโนโลยีดิจิทัล
							และขับเคลื่อน BCG Model (Bio-Circular-Green Economy) เพื่อการพัฒนาที่ยั่งยืน สมดุล
							ทั้งในด้านเศรษฐกิจ สังคม และสิ่งแวดล้อม
							กรมส่งเสริมการเกษตรเป็นหน่วยงานหลักในการรับขึ้นทะเบียนเกษตรกร
							รับแจ้งข้อมูลเกษตรกรผู้ประสบภัยพิบัติ
							เป็นคณะกรรมการประเมินความเสียหายของแปลงเกษตรกรที่ประสบภัย
							รวมถึงการวางแผนช่วยเหลือและพัฒนาเกษตรกร
							เจ้าหน้าที่ส่งเสริมการเกษตรจะตรวจสอบพื้นที่ที่ได้รับความเสียหายหลังเกิดภัยพิบัติ
							และเชื่อมโยงข้อมูลให้กับธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร (ธ.ก.ส.)
							และสมาคมประกันวินาศภัยไทย
							เพื่อใช้ประกอบการพิจารณาจ่ายค่าสินไหมทดแทนให้กับเกษตรกรที่ทำประกันภัย
							ซึ่งกระบวนการนี้อาจใช้เวลาพอสมควร ดังนั้น เพื่อให้การจ่ายค่าสินไหมทดแทนมีความรวดเร็วมากขึ้น
							จึงได้ร่วมมือกับบริษัท ไทยคม จำกัด (มหาชน) และสมาคมประกันวินาศภัยไทย
							เพื่อนำความรู้และความเชี่ยวชาญ มาพัฒนาแนวทางการใช้วิทยาศาสตร์และเทคโนโลยีในประกันภัยพืชผล
							ซึ่งถือเป็นจุดเริ่มต้นและโอกาสที่ดีในการพัฒนาระบบประกันภัยพืชผลให้ยั่งยืน ถูกต้อง และแม่นยำ
							ด้วยการใช้เทคโนโลยีดาวเทียมสำรวจทรัพยากรโลก และเทคโนโลยีปัญญาประดิษฐ์ร่วมกับข้อมูลขนาดใหญ่
							นอกจากนี้ยังเป็นการสร้างแรงจูงใจให้เกษตรกรหันมาใช้ประกันภัยเป็นทางเลือกในการบริหารจัดการความเสี่ยงในการเกษตร
							และเป็นประโยชน์ต่อหน่วยงานภาครัฐและประชาชน
							อีกทั้งยังช่วยยกระดับคุณภาพชีวิตของเกษตรกรไทยให้มีความเป็นอยู่ที่ดีขึ้นด้วยความมั่นคง
							เพราะภาคเกษตรกรรมเป็นรากฐานที่สำคัญของระบบเศรษฐกิจของประเทศไทย
						</Typography>
						<Typography className='indent-8 text-sm font-normal'>
							ปัจจุบัน เกษตรกรไทยต้องเผชิญกับความแปรปรวนของสภาพอากาศ ศัตรูพืช และโรคระบาด
							ส่งผลให้ความถี่และความรุนแรงของภัยธรรมชาติเพิ่มขึ้น
							เพื่อให้เกษตรกรมีทางเลือกในการบริหารจัดการความเสี่ยงที่ดีขึ้น
							การพัฒนาระบบประกันภัยพืชผลที่ยั่งยืนจึงเป็นสิ่งจำเป็น
							สมาคมประกันวินาศภัยไทยซึ่งเป็นผู้บริหารโครงการประกันภัยพืชผลของประเทศไทย ตั้งแต่ปีการผลิต
							2554 เป็นต้นมา มีความเชี่ยวชาญในงานประกันภัยพืชผลเป็นอย่างดี
							ความร่วมมือกับกรมส่งเสริมการเกษตรและไทยคมครั้งนี้
							ได้นำแนวทางการประเมินความเสียหายเชิงวิทยาศาสตร์และเทคโนโลยีมาใช้ในการประเมินความเสียหาย เช่น
							เทคโนโลยีการรับรู้ระยะไกล (remote sensing) จากภาพถ่ายดาวเทียม ข้อมูลอุตุนิยมวิทยา
							และการเก็บข้อมูลรายแปลงด้วย mobile technology
							และมีแนวคิดที่จะต่อยอดพัฒนารูปแบบการประเมินผลให้ครอบคลุมและมีประสิทธิภาพยิ่งขึ้น
						</Typography>
						<Typography className='indent-8 text-sm font-normal'>
							ไทยคมมีเจตนารมณ์ในการดำเนินธุรกิจให้เติบโตอย่างมั่นคง ควบคู่กับการพัฒนาประเทศให้ยั่งยืน
							ด้วยการพัฒนาโซลูชันที่ใช้ Big Data จากอวกาศ วิเคราะห์ร่วมกับ Artificial Intelligence (AI)
							และ Machine Learning (ML) เพื่อใช้ในการบริหารจัดการในหลายมิติ
							โดยเฉพาะภาคการเกษตรซึ่งเป็นอุตสาหกรรมสำคัญของประเทศ
							การร่วมมือกับกรมส่งเสริมการเกษตรและสมาคมประกันวินาศภัยไทยในครั้งนี้
							ย้ำถึงพันธกิจของไทยคมในการนำความเชี่ยวชาญด้านธุรกิจดาวเทียมและเทคโนโลยีอวกาศมาต่อยอดเป็นแพลตฟอร์มประกันภัยพืชผล
							เพื่อให้เกษตรกรที่ได้รับผลกระทบได้รับประโยชน์สูงสุดจากโครงการนี้
						</Typography>
					</div>
				) : (
					<div className='space-y-4 overflow-scroll px-6'>
						<div className='flex justify-center py-4'>
							<iframe
								width='560'
								height='315'
								className='rounded-xl'
								src={link}
								title='YouTube video player'
								allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
								referrerPolicy='strict-origin-when-cross-origin'
								allowFullScreen
							></iframe>
						</div>
						<Typography className='text-base font-semibold'>
							The Department of Agricultural Extension partners with the Thai General Insurance
							Association and Thaicom to elevate the standard of crop insurance for Thai farmers using
							satellite data and space technology.
						</Typography>
						<Typography className='indent-8 text-sm font-normal'>
							The Department of Agricultural Extension has joined forces with two organizations to sign a
							collaboration agreement on a project aimed at assisting farmers affected by disasters. This
							initiative leverages satellite data in crop insurance systems to jointly develop methods to
							apply science and technology to crop insurance for Thai farmers, with the goal of raising
							the standards of agricultural insurance through the effective use of space technology.
						</Typography>
						<Typography className='indent-8 text-sm font-normal'>
							Under this collaboration, the Department of Agricultural Extension, the Thai General
							Insurance Association, and Thaicom will work together to integrate science and technology
							into crop insurance. This will involve using Earth Observation Satellite technology, Data
							Analytics Systems, and Artificial Intelligence/Machine Learning to analyze big data such as
							agricultural plot information, rice varieties, disaster-affected areas, and more. The
							primary goal is to plan and provide assistance to disaster-affected farmers so they can
							receive compensation quickly and accurately, thereby reducing costs for farmers.
							Additionally, this collaboration will provide the government with accurate data for timely
							disaster response planning, help mitigate future risks, and ensure efficient budget
							management. The partnership also aims to integrate and share various types of information,
							such as GIS data and research, to enhance the capabilities of personnel across the three
							organizations. This will ultimately drive the advancement of the country{"'"}s agricultural
							sector.
						</Typography>
						<Typography className='indent-8 text-sm font-normal'>
							For 2024, the Department of Agricultural Extension has outlined its mission to drive
							agricultural promotion at the regional level, focusing on creating high-value agricultural
							products and efficiently utilizing available resources. The initiative promotes
							environmentally friendly farming (Low Carbon), increases green areas in agriculture, adopts
							digital technology in operations, and advances the BCG Model (Bio-Circular-Green Economy).
							The Department of Agricultural Extension is the primary agency responsible for registering
							farmers, reporting disaster-affected farmers, assessing damage to agricultural plots, and
							planning agricultural assistance and development. Extension officers will verify the damaged
							areas after disasters and link the data to the Bank for Agriculture and Agricultural
							Cooperatives (BAAC) and the Thai General Insurance Association for compensation
							considerations. Since this process can be time-consuming, a collaboration with Thaicom
							Public Company Limited and the Thai General Insurance Association has been established to
							leverage their expertise and knowledge to develop and integrate scientific and technological
							systems into crop insurance. This initiative marks the beginning of a significant
							opportunity to develop a sustainable and accurate crop insurance system using Earth
							Observation Satellite technology and AI to analyze big data. Additionally, it aims to
							motivate farmers to adopt insurance as a risk management tool in agriculture, benefiting
							both government agencies and the public, and improving the quality of life for Thai farmers
							by providing greater stability, given that agriculture is the foundation of Thailand{"'"}s
							economy.
						</Typography>
						<Typography className='indent-8 text-sm font-normal'>
							Currently, Thai farmers face challenges from climate variability, pests, and diseases,
							leading to an increase in the frequency and severity of natural disasters. To provide
							farmers with better risk management options, developing a sustainable crop insurance system
							is essential. The Thai General Insurance Association, which has managed the country{"'"}s
							crop insurance programs since the 2011 production season, has significant expertise in
							agricultural crop insurance. This collaboration with the Department of Agricultural
							Extension and Thaicom will incorporate scientific and technological evaluation methods into
							damage assessment, such as remote sensing technology from satellite imagery, meteorological
							data, and plot-level data collection using mobile technology, with the aim of further
							developing these methods to be more comprehensive and efficient.
						</Typography>
						<Typography className='indent-8 text-sm font-normal'>
							Thaicom is committed to growing its business sustainably while contributing to the country’s
							development by creating solutions that use space-derived Big Data analyzed with Artificial
							Intelligence (AI) and Machine Learning (ML) to inform management planning across multiple
							dimensions, particularly in Thailand{"'"}s agricultural sector, a key industry for the
							country. This collaboration with the Department of Agricultural Extension and the Thai
							General Insurance Association underscores Thaicom{"'"}s mission to leverage its expertise in
							satellite and space technology to create a crop insurance platform that maximizes benefits
							for farmers affected by disasters.
						</Typography>
					</div>
				)}
			</div>
		</div>
	)
}

export default AboutMain
