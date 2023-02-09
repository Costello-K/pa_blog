import os
import uuid


class FilePath:
    def __init__(self, file_path: str = ''):
        self.file_path = file_path

    """Creates a unique name for a file"""
    @staticmethod
    def _generate_file_name(file_name: str) -> str:
        ext = file_name.strip().split('.')[-1]
        return f'{uuid.uuid4()}.{ext}'

    def get_file_path(self, instance, file_name: str) -> str:
        return os.path.join(f'{self.file_path}', self._generate_file_name(file_name))
