import { useState } from 'react'

export default function ImageUpload() {
  const [uploadedImg, setUploadedImg] = useState(null);

  return (
	<div className="image-input">
		<label for="file-upload" class="custom-file-upload"> Upload image </label>
		<input type="file" name="file-upload" id="file-upload" accept="image/*" onChange={(event) => {
			setUploadedImg(event.target.files[0].name);
		}}>
		</input>
		{uploadedImg === null ? "No file selected" : uploadedImg}
	</div>
  )
}

