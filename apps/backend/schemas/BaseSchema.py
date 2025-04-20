class BaseSchema(BaseModel):
    class Config:
        extra = "forbid"
