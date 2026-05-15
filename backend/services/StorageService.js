import "dotenv/config";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { createReadStream } from "fs";

class StorageService {
	constructor() {
		this.s3 = new S3Client({
			region: process.env.AWS_REGION,
			credentials: {
				accessKeyId: process.env.AWS_ACCESS_KEY_ID,
				secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
			},
		});
		this.bucket = process.env.S3_BUCKET_NAME;
		this.presignedUrlExpiry = Number(process.env.S3_PRESIGNED_URL_EXPIRY) || 3600;
	}

	// Streams a local temp file to S3 — avoids loading the whole file into memory
	async uploadFile(localFilePath, s3Key) {
		const fileStream = createReadStream(localFilePath);

		const upload = new Upload({
			client: this.s3,
			params: {
				Bucket: this.bucket,
				Key: s3Key,
				Body: fileStream,
				ContentType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
			},
		});

		await upload.done();
	}

	// Returns a time-limited presigned URL for the given S3 key
	async getPresignedUrl(s3Key) {
		const command = new GetObjectCommand({ Bucket: this.bucket, Key: s3Key });
		return await getSignedUrl(this.s3, command, { expiresIn: this.presignedUrlExpiry });
	}
}

export default StorageService;
