import { useState } from 'react'

interface imgFile {
	file: string;
}

export default function ImageUpload(props:imgFile) {
  const [uploadedImg, setUploadedImg] = useState(props.file)

  return (
	<div className="image-input">
		<label for="image_url" class="custom-file-upload"> Upload image </label>
		<input type="file" name="image_url" id="image_url" accept="image/*"
		onChange={(event) => {
			setUploadedImg(event.target.files[0].name);
		}}>
		</input>
		{uploadedImg === null ? "No file selected" : uploadedImg}
	</div>
  )
}

