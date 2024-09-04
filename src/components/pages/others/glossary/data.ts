export const glossaryData = [
	{
		word: {
			th: 'พื้นที่ทบก.',
			en: 'Farmmer registration area',
		},
		meaning: {
			th: 'พื้นที่ปลูกข้าวที่ขึ้นทะเบียนเกษตรที่เข้าเกณฑ์ข้าวนาปี',
			en: 'Registered agricultural land that qualifies for in- season rice cultivation',
		},
	},
    {
        word:{
            th:'ทบก.',
            en:'Farmmer registration',
        },
        meaning: {
            th:'ทะเบียนเกษตรกร 01',
            en:'Farmmer registration 01',
        }
    },
    {
        word:{
            th:'พื้นที่เสียหายจริง/กษ.02',
            en:'Actual damaged area /GS.02',
        },
        meaning: {
            th:'พื้นที่เสียหายตามการสำรวจกษ.02',
            en:'Damaged area according to the GS.02 survey',
        }
    },
    {
        word:{
            th:'พื้นที่เยียวยา',
            en:'Compensation area',
        },
        meaning: {
            th:'พื้นที่ที่ได้รับการเยียวยา จากกระทรวงการคลัง ไม่เกินครัวเรือนละ 30 ไร่',
            en:'Areas compensated by the Ministry of Finance, not exceeding 30 rai per household',
        }
    },{
        word:{
            th:'พื้นที่เอาประกัน',
            en:'Insured area',
        },
        meaning: {
            th:'พื้นที่ปลูกข้าวที่ขึ้นทะเบียนเกษตรกรที่เข้าเกณฑ์ข้าวนาปีและซื้อประกัน (ซื้อเองหรือเป็นลูกค้า ธกส.)',
            en:'Registered rice cultivation areas that qualify for the inin-season and are insured (either self-purchased or as BAAC customers)',
        }
    },{
        word:{
            th:'พื้นที่เคลมประกัน',
            en:'Insurance claim area',
        },
        meaning: {
            th:'พื้นที่เสียหายตามการสำรวจกษ.02 และ เป็นพื้นที่ที่มีประกัน',
            en:'Damaged area according to the GS.02 survey that is also insured',
        }
    },{
        word:{
            th:'สินไหมทดแทน',
            en:'Compensation claim',
        },
        meaning: {
            th:'เงินที่จ่ายให้กับพื้นที่ที่เคลมประกัน',
            en:'Payout for insured areas with claims',
        }
    },{
        word:{
            th:'พื้นที่ประมาณการเยียวยา',
            en:'Estimated compensation area',
        },
        meaning: {
            th:'ใช้ผลการ Predict ในพื้นที่เยียวยา ที่มีขอบแปลง (ไม่เกินครัวเรือนละ 30 ไร่) มาประมาณการเยียวยาในพื้นที่ที่ไม่มีขอบแปลง ดำเนินการประมาณเฉพาะในแปลง ปีใหม่ๆ เริ่มตั้งแต่ 2024',
            en:'Use the prediction results for compensation areas with plot boundaries (not exceeding 30 rai per household) to estimate compensation in areas without plot boundaries. This estimation will be applied only to new plots, starting from 2024',
        }
    },{
        word:{
            th:'พื้นที่ประมาณการเคลมประกัน',
            en:'Estimated insurance claim area',
        },
        meaning: {
            th:'ใช้ผลการ ทำนายจากโมเดล ในพื้นที่เอาประกัน. ที่มีขอบแปลง มาประมาณการเคลมประกันในพื้นที่ที่ไม่มีขอบแปลง ดำเนินการประมาณเฉพาะในแปลง ปีใหม่ๆ เริ่มตั้งแต่ 2024',
            en:'Use the prediction results from the model for insured areas with plot boundaries to estimate insurance claims in areas without plot boundaries. This estimation will be applied only to new plots, starting from 2024',
        }
    },{
        word:{
            th:'มีขอบแปลง',
            en:'plot boundaries',
        },
        meaning: {
            th:'พื้นที่ทบก. ที่มีขอบแปลง (polygon)',
            en:'Registered area with plot boundaries (polygon)',
        }
    },{
        word:{
            th:'ไม่มีขอบแปลง',
            en:'Without plot boundaries',
        },
        meaning: {
            th:'พื้นที่ทบก. ที่ไม่มีขอบแปลง (polygon)',
            en:'Registered area without plot boundaries (polygon)',
        }
    },{
        word:{
            th:'กษ.01',
            en:'GS.01',
        },
        meaning: {
            th:'แบบยื่นความจำนงขอรับความช่วยเหลือ จนท.กรมส่งเสริมดึงข้อมูลผู้มีสิทธิ์ได้รับความช่วยเหลือจากข้อมูลทบก.',
            en:'Assistance Request Form,Officers from the Department of Agricultural Extension will extract data on eligible recipients from the registration database.',
        }
    },{
        word:{
            th:'กษ.02',
            en:'GS.02',
        },
        meaning: {
            th:'แบบประมวลรวบรวมความเสียหายและการช่วยเหลือ ระดับหมู่บ้าน ตำบล อำเภอ รายชื่อผู้ได้รับความช่วยเหลือ หลังผ่านการประชาคม',
            en:'Damage and Assistance Summary Form at the Village, Sub-district, and District Levels: List of recipients who have received assistance after community approval',
        }
    },{
        word:{
            th:'โครงการเยียวยาผู้ประสบภัยพิบัติด้านการเกษตร',
            en:'Agricultural Disaster Relief Program',
        },
        meaning: {
            th:'โครงการเงินช่วยเหลือจากภาครัฐ ไม่เกินครัวเรือนละ 30 ไร่ เกษตรกรจะเรียก เงินช่วย 30 ไร่หรือบ้านละ 20,000 เงื่อนไขการตรวจสอบภัยพิบัติ ผู้มีสิทธิ์ได้รับความช่วยเหลือตาม กษ.01 และอยู่ในเขตประกาศภัย',
            en:'Government Assistance Program, limited to 30 rai per household: Farmers can claim assistance for up to 30 rai or 20,000 THB per household Disaster verification conditions: Eligibility for assistance is based on GS.01 and being within the declared disaster zone.',
        }
    },{
        word:{
            th:'โครงการประกันภัยข้าวนาปี',
            en:'In- Season Rice Insurance Program',
        },
        meaning: {
            th:'โครงการที่รัฐและธกส. ช่วยอุกหนุนเบี้ยประกัน เกษตรกรจะเรียก โครงการ ธกส.',
            en:'Government and BAAC Subsidized Insurance Program: Farmers can refer to it as the BAAC Program',
        }
    },
]
