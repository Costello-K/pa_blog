import os
import uuid


class SetFilePath:
    def __init__(self, file_path: str = None):
        self.file_path = file_path

    """Creates a unique name for a file"""
    @staticmethod
    def _generate_file_name(file_name: str) -> str:
        ext = file_name.strip().split('.')[-1]
        return f'{uuid.uuid4()}.{ext}'

    def get_file_path(self, obj, file_name: str):
        return os.path.join(f'{self.file_path}', self._generate_file_name(file_name))

    # @staticmethod
    # def get_file_name(filename: str):
    #     ext = filename.strip().split('.')[-1]
    #     filename = f'{uuid.uuid4()}.{ext}'
    #     return os.path.join('video/about', filename)
    #
    # title = models.CharField(max_length=100)
    # description = models.TextField(max_length=200)
    # video = models.FileField(upload_to=get_file_name)
