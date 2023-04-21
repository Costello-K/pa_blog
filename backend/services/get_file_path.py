import os
import uuid


class FilePath:
    """Generate file path"""
    def get_path_with_unique_filename(self, file_name: str, file_path: str) -> str:
        """
        Method to generate unique file path and name using UUID
            :param file_name: name of the file
            :param file_path: path where file should be saved
            :return: file path and unique file name
        """
        ext = file_name.strip().split('.')[-1]  # get input file extension
        return os.path.join(f'{file_path}', f'{uuid.uuid4()}.{ext}')
