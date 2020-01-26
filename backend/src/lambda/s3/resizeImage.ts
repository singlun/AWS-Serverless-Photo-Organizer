import { SNSHandler, SNSEvent, S3Event } from 'aws-lambda'
import 'source-map-support/register'
import { createLogger } from '../../utils/logger'
import { attachUrlToFeed, processImage } from '../../businessLogic/udagram'

const logger = createLogger('attachimageUrl')

const thumbnailBucketName = process.env.THUMBNAILS_S3_BUCKET
const region = process.env.BUCKET_REGION

export const handler: SNSHandler = async (event: SNSEvent) => {
  
  logger.info('Event Processing', event)

  for (const snsRecord of event.Records) {

    const s3EventStr = snsRecord.Sns.Message

    logger.info('Processing S3 event', {event: s3EventStr})

    const s3Event = JSON.parse(s3EventStr)

    await processEvent(s3Event)    
  }
 }

 async function processEvent(s3Event: S3Event) {
  for (const record of s3Event.Records) {
    let key = record.s3.object.key

    logger.info('Image Key', {key})

    await processImage(key)

    const imageUrl: string = `https://${thumbnailBucketName}.s3.${region}.amazonaws.com/${key}.jpeg`

    logger.info('imageUrl', {imageUrl})    

    await attachUrlToFeed(imageUrl, key) 
       
  }
}
